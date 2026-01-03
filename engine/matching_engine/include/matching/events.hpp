#pragma once
#include <string>
#include <variant>
#include "matching/types.hpp"

namespace matching {
    struct OrderAccepted { OrderId id; };
    struct OrderRejected { std::string reason; };
    struct OrderCanceled { OrderId id; };

    struct Trade {
        OrderId maker_order_id;
        OrderId taker_order_id;
        Price price;
        Qty qty;
    };

    using Event = std::variant<OrderAccepted, OrderRejected, OrderCanceled, Trade>;
}
