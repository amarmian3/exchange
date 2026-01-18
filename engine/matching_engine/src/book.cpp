#include "matching/book.hpp"
#include "matching/types.hpp"
#include <stdexcept>
#include <utility>
#include <algorithm>

namespace matching {

    OrderBook::OrderBook(Symbol symbol)
        : symbol_(std::move(symbol)) {
    }

    bool OrderBook::crosses(Side incoming_side, Price incoming_price, Price resting_price) {
        switch (incoming_side) {
        case Side::Bid:
            return incoming_price >= resting_price;
        case Side::Ask:
            return incoming_price <= resting_price;
        }

        throw std::logic_error("Invalid Side in OrderBook::crosses");
    }

    std::vector<Event> OrderBook::place_limit(
        const UserId& user,
        Side side,
        Price price,
        Qty qty)
    {
    
        std::vector<Event> events;
        if (qty <= 0) {
            events.push_back(OrderRejected{ "qty must be > 0" });
            return events;
        }

        OrderId order_id = next_order_id_++;
        std::uint64_t seq = next_seq_++;
        events.push_back(OrderAccepted{ order_id });

        Qty remaining = qty;

        if (side == Side::Bid) {
            // Incoming BID matches against asks_ (best ask = lowest ask = asks_.begin())
            while (remaining > 0 && !asks_.empty()) {
                // map is a type of dictionary
                std::map<Price, Level, std::less<Price>>::iterator best_it = asks_.begin();
                // best price from best_ask map
                Price best_price = best_it->first;
                // quantity at best price from best_ask map
                Level& level = best_it->second;
                // order id of the first person in the queue at the best price
                Order& maker = level.front();

                // e.g. side is BID, if price = 10 and best_price is 9 an best_price is 10
                // then it will break since you cant fill any orders in the asks
                if (!crosses(side, price, best_price)) {
                    break;
                }

                Qty traded = std::min(remaining, maker.qty_remaining);

                remaining -= traded;
                maker.qty_remaining -= traded;

                events.push_back(Trade{
                    maker.id,
                    order_id,
                    best_price,
                    traded
                    });

                if (maker.qty_remaining == 0) {
                    level.pop_front();
                }
                if (level.empty()) {
                    asks_.erase(best_it);
                }
            }

            // 5) Rest leftover on bids_
            if (remaining > 0) {
                bids_[price].push_back(Order{
                    order_id,
                    user,
                    side,
                    price,
                    remaining,
                    seq
                    });
            }
        }
        else if (side == Side::Ask) {
            // Incoming ASK matches against bids_ (best bid = highest bid = bids_.begin())
            while (remaining > 0 && !bids_.empty()) {
                std::map<Price, Level, std::greater<Price>>::iterator best_it = bids_.begin();
                Price best_price = best_it->first;
                Level& level = best_it->second;
                Order& maker = level.front();

                if (!crosses(side, price, best_price)) {
                    break;
                }

                Qty traded = std::min(remaining, maker.qty_remaining);

                remaining -= traded;
                maker.qty_remaining -= traded;

                events.push_back(Trade{
                    maker.id,
                    order_id,
                    best_price,
                    traded
                    });

                if (maker.qty_remaining == 0) {
                    level.pop_front();
                }
                if (level.empty()) {
                    bids_.erase(best_it);
                }
            }

            // 5) Rest leftover on asks_
            if (remaining > 0) {
                asks_[price].push_back(Order{
                    order_id,
                    user,
                    side,
                    price,
                    remaining,
                    seq
                    });
            }
        }
        else {
            throw std::logic_error("Invalid Side in OrderBook::place_limit");
        }

        return events;

    }

    std::vector<Event> OrderBook::cancel(OrderId id)
    {
        std::vector<Event> events;

        // 1) Search bids_ (map<Price, deque<Order>>)
        {
            std::map<Price, Level, std::greater<Price>>::iterator level_it = bids_.begin();
            for (; level_it != bids_.end(); ++level_it) {
                Level& level = level_it->second;

                Level::iterator order_it = level.begin();
                for (; order_it != level.end(); ++order_it) {
                    if (order_it->id == id) {
                        // Remove the order from the level
                        level.erase(order_it);

                        // If the price level is empty, remove the level from the book
                        if (level.empty()) {
                            bids_.erase(level_it);
                        }

                        events.push_back(OrderCanceled{ id });
                        return events;
                    }
                }
            }
        }

        // 2) Search asks_
        {
            std::map<Price, Level, std::less<Price>>::iterator level_it = asks_.begin();
            for (; level_it != asks_.end(); ++level_it) {
                Level& level = level_it->second;

                Level::iterator order_it = level.begin();
                for (; order_it != level.end(); ++order_it) {
                    if (order_it->id == id) {
                        level.erase(order_it);

                        if (level.empty()) {
                            asks_.erase(level_it);
                        }

                        events.push_back(OrderCanceled{ id });
                        return events;
                    }
                }
            }
        }

        // 3) Not found -> reject
        events.push_back(OrderRejected{ "order id not found" });
        return events;
    }


}



