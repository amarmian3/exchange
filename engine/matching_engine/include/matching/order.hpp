#pragma once
#include "matching/types.hpp"

namespace matching {
    enum class Side { Bid, Ask };

    struct Order {
        OrderId id{};
        UserId user;
        Side side{ Side::Bid };
        Price price{};
        Qty qty_remaining{};
        std::uint64_t seq{};
    };
}
