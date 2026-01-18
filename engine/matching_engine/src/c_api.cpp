#include "matching/c_api.h"

#include <new>
#include <sstream>
#include <string>
#include <cstring>
#include <type_traits>
#include <vector>

#include "matching/engine.hpp"
#include "matching/events.hpp"
#include "matching/order.hpp"
#include "matching/book.hpp"

namespace {

    static std::string json_escape(const std::string& s) {
        std::string out;
        out.reserve(s.size() + 8);
        for (char c : s) {
            switch (c) {
            case '\\': out += "\\\\"; break;
            case '"':  out += "\\\""; break;
            case '\n': out += "\\n"; break;
            case '\r': out += "\\r"; break;
            case '\t': out += "\\t"; break;
            default:
                if (static_cast<unsigned char>(c) < 0x20) out += ' ';
                else out += c;
                break;
            }
        }
        return out;
    }

    static std::string events_to_json(const std::string& symbol,
        const std::vector<matching::Event>& events) {
        std::ostringstream oss;
        oss << "{\"symbol\":\"" << json_escape(symbol) << "\",\"events\":[";
        bool first = true;

        for (const auto& ev : events) {
            if (!first) oss << ',';
            first = false;

            std::visit([&](const auto& e) {
                using T = std::decay_t<decltype(e)>;
                if constexpr (std::is_same_v<T, matching::OrderAccepted>) {
                    oss << "{\"type\":\"accepted\",\"id\":" << e.id << "}";
                }
                else if constexpr (std::is_same_v<T, matching::OrderRejected>) {
                    oss << "{\"type\":\"rejected\",\"reason\":\"" << json_escape(e.reason) << "\"}";
                }
                else if constexpr (std::is_same_v<T, matching::OrderCanceled>) {
                    oss << "{\"type\":\"canceled\",\"id\":" << e.id << "}";
                }
                else if constexpr (std::is_same_v<T, matching::Trade>) {
                    oss << "{\"type\":\"trade\",\"maker_order_id\":" << e.maker_order_id
                        << ",\"taker_order_id\":" << e.taker_order_id
                        << ",\"price\":" << e.price
                        << ",\"qty\":" << e.qty
                        << "}";
                }
                else {
                    oss << "{\"type\":\"unknown\"}";
                }
                }, ev);
        }

        oss << "]}";
        return oss.str();
    }

    static int write_out(const std::string& json, char** out_json, std::size_t* out_len) {
        if (!out_json || !out_len) return -1;

        char* mem = static_cast<char*>(::operator new(json.size() + 1, std::nothrow));
        if (!mem) return -3;

        std::memcpy(mem, json.data(), json.size());
        mem[json.size()] = '\0';

        *out_json = mem;
        *out_len = json.size();
        return 0;
    }



    template <class Compare>
    static void append_orderbook_levels_json(
        std::string& json,
        const std::map<matching::Price, std::deque<matching::Order>, Compare>& levels
    ) {
        json += "[";
        bool first_level = true;

        for (const std::pair<const matching::Price, std::deque<matching::Order>>& level_pair : levels) {
            const matching::Price price = level_pair.first;
            const std::deque<matching::Order>& level = level_pair.second;

            std::uint64_t qty_sum = 0;
            for (const matching::Order& o : level) {
                qty_sum += static_cast<std::uint64_t>(o.qty_remaining);
            }

            if (!first_level) json += ",";
            first_level = false;

            json += "{";
            json += "\"price\":";
            json += std::to_string(static_cast<std::uint64_t>(price));
            json += ",\"qty\":";
            json += std::to_string(qty_sum);
            json += "}";
        }

        json += "]";
    }


    static matching::Side parse_side(int side) {
        return (side == 0) ? matching::Side::Bid : matching::Side::Ask;
    }

} // namespace

extern "C" {

    void* me_create() {
        return new (std::nothrow) matching::Engine();
    }

    void me_destroy(void* engine) {
        delete static_cast<matching::Engine*>(engine);
    }

    int me_place_limit(void* engine,
        const char* symbol,
        const char* user,
        int side,
        std::int64_t price,
        std::int64_t qty,
        char** out_json,
        std::size_t* out_len) {
        if (!engine || !symbol || !user) return -1;

        try {
            matching::Engine* eng = static_cast<matching::Engine*>(engine);
            matching::OrderBook& book = eng->book_for(matching::Symbol{ symbol });
            std::vector<matching::Event> events = book.place_limit(matching::UserId{ user }, parse_side(side), price, qty);
            return write_out(events_to_json(symbol, events), out_json, out_len);
        }
        catch (const std::exception& ex) {
            const std::string json =
                std::string{ "{\"symbol\":\"" } + json_escape(symbol) +
                "\",\"events\":[{\"type\":\"rejected\",\"reason\":\"" +
                json_escape(ex.what()) + "\"}]}";
            return write_out(json, out_json, out_len);
        }
        catch (...) {
            const std::string json =
                std::string{ "{\"symbol\":\"" } + json_escape(symbol) +
                "\",\"events\":[{\"type\":\"rejected\",\"reason\":\"unknown error\"}]}";
            return write_out(json, out_json, out_len);
        }
    }

    int me_cancel(void* engine,
        const char* symbol,
        std::uint64_t order_id,
        char** out_json,
        std::size_t* out_len) {
        if (!engine || !symbol) return -1;

        try {
            matching::Engine* eng = static_cast<matching::Engine*>(engine);
            matching::OrderBook& book = eng->book_for(matching::Symbol{ symbol });
            std::vector<matching::Event> events = book.cancel(order_id);
            return write_out(events_to_json(symbol, events), out_json, out_len);
        }
        catch (const std::exception& ex) {
            const std::string json =
                std::string{ "{\"symbol\":\"" } + json_escape(symbol) +
                "\",\"events\":[{\"type\":\"rejected\",\"reason\":\"" +
                json_escape(ex.what()) + "\"}]}";
            return write_out(json, out_json, out_len);
        }
        catch (...) {
            const std::string json =
                std::string{ "{\"symbol\":\"" } + json_escape(symbol) +
                "\",\"events\":[{\"type\":\"rejected\",\"reason\":\"unknown error\"}]}";
            return write_out(json, out_json, out_len);
        }
    }

    int me_show_orderbook(
        void* engine,
        const char* symbol,
        char** out_json,
        std::size_t* out_len
    ) {
        if (!engine || !symbol) return -1;

        try {
            // converts engine to matching::Engine type
            matching::Engine* eng = static_cast<matching::Engine*>(engine);
            // arrow operator retrieves a variable from a pointer
            matching::OrderBook& book = eng->book_for(matching::Symbol{ symbol });


            // ---- build JSON in std::string ----
            std::string json;
            json.reserve(512);

            json += "{";
            json += "\"symbol\":\"";
            json += json_escape(book.symbol());
            json += "\",";

            json += "\"bids\":";
            append_orderbook_levels_json(json, book.bids()); 
            json += ",";

            json += "\"asks\":";
            append_orderbook_levels_json(json, book.asks());
            json += "}";

            return write_out(json, out_json, out_len);
        }
        catch (const std::exception& ex) {
            const std::string json =
                std::string{ "{\"symbol\":\"" } + json_escape(symbol) +
                "\",\"events\":[{\"type\":\"rejected\",\"reason\":\"" +
                json_escape(ex.what()) + "\"}]}";
            return write_out(json, out_json, out_len);
        }
        catch (...) {
            const std::string json =
                std::string{ "{\"symbol\":\"" } + json_escape(symbol) +
                "\",\"events\":[{\"type\":\"rejected\",\"reason\":\"unknown error\"}]}";
            return write_out(json, out_json, out_len);
        }
    }

    void me_free(char* p) {
        ::operator delete(p);
    }

} // extern "C"
