#pragma once
#include <cstdint>
#include <string>

namespace matching {
	using OrderId = std::uint64_t;
	using Price = std::int64_t;  // ticks
	using Qty = std::int64_t;  // units
	using UserId = std::string;
	using Symbol = std::string;
}
