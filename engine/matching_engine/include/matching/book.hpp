#pragma once

#include <map>
#include <deque>
#include <vector>
#include <functional>

#include "matching/events.hpp"
#include "matching/order.hpp"
#include "matching/types.hpp"

// This defines what operations are allowed on trades

namespace matching {

	class OrderBook {
	public:
		explicit OrderBook(Symbol symbol);

		// Places a LIMIT order. Returns events (Accepted + Trades + possibly more later).
		std::vector<Event> place_limit(const UserId& user, Side side, Price price, Qty qty);

		// Cancels an existing order by id. Returns Canceled or Rejected.
		std::vector<Event> cancel(OrderId id);

		const Symbol& symbol() const { return symbol_; }

	private:
		Symbol symbol_;

		// Order id + time priority counters (per book)
		OrderId next_order_id_{ 1 };
		std::uint64_t next_seq_{ 1 };

		// Price levels: FIFO within each level via deque
		using Level = std::deque<Order>;

		std::map<Price, Level, std::greater<Price>> bids_;
		std::map<Price, Level, std::less<Price>> asks_;

		// helpers
		static bool crosses(Side taker_side, Price taker_price, Price maker_price);
	};

} 
