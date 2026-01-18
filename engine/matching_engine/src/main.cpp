#include <iostream>
#include <variant>

#include "matching/book.hpp"
#include "matching/events.hpp"
#include "matching/types.hpp"

namespace {

    // Helper to print a single Event
    void print_event(const matching::Event& ev)
    {
        struct Visitor {
            void operator()(const matching::OrderAccepted& e) const {
                std::cout << "OrderAccepted: id=" << e.id << "\n";
            }
            void operator()(const matching::OrderRejected& e) const {
                std::cout << "OrderRejected: reason=\"" << e.reason << "\"\n";
            }
            void operator()(const matching::OrderCanceled& e) const {
                std::cout << "OrderCanceled: id=" << e.id << "\n";
            }
            void operator()(const matching::Trade& t) const {
                std::cout << "Trade: maker=" << t.maker_order_id
                    << " taker=" << t.taker_order_id
                    << " price=" << t.price
                    << " qty=" << t.qty << "\n";
            }
        };

        std::visit(Visitor{}, ev);
    }

    // Helper to print a vector of events
    void print_events(const std::vector<matching::Event>& events)
    {
        for (std::vector<matching::Event>::const_iterator it = events.begin(); it != events.end(); ++it) {
            print_event(*it);
        }
    }

    // Extract the first accepted id from an events vector (returns 0 if none found)
    matching::OrderId first_accepted_id(const std::vector<matching::Event>& events)
    {
        for (std::vector<matching::Event>::const_iterator it = events.begin(); it != events.end(); ++it) {
            const matching::OrderAccepted* acc = std::get_if<matching::OrderAccepted>(&(*it));
            if (acc != nullptr) {
                return acc->id;
            }
        }
        return matching::OrderId{}; // default
    }

} // namespace

int main()
{
    // Adjust construction if your Symbol type isn't constructible from a string literal.
    matching::OrderBook book(matching::Symbol{ "TEST" });

    // Seed the book with a couple of resting orders on each side
    std::cout << "---- Place Ask 10 @ 10 ----\n";
    std::vector<matching::Event> e1 = book.place_limit(matching::UserId{ 1 }, matching::Side::Ask, matching::Price{ 10 }, matching::Qty{ 10 });
    print_events(e1);
    matching::OrderId ask_id = first_accepted_id(e1);

    std::cout << "---- Place Bid 5 @ 9 ----\n";
    std::vector<matching::Event> e2 = book.place_limit(matching::UserId{ 2 }, matching::Side::Bid, matching::Price{ 9 }, matching::Qty{ 5 });
    print_events(e2);
    matching::OrderId bid_id = first_accepted_id(e2);

    // Cancel the ask we placed (should succeed if it still rests; if it traded, cancel may reject)
    std::cout << "---- Cancel Ask id=" << ask_id << " ----\n";
    std::vector<matching::Event> c1 = book.cancel(ask_id);
    print_events(c1);

    // Cancel a non-existent id
    std::cout << "---- Cancel non-existent id=999999 ----\n";
    std::vector<matching::Event> c2 = book.cancel(matching::OrderId{ 999999 });
    print_events(c2);

    // Cancel the bid we placed
    std::cout << "---- Cancel Bid id=" << bid_id << " ----\n";
    std::vector<matching::Event> c3 = book.cancel(bid_id);
    print_events(c3);

    return 0;
}
