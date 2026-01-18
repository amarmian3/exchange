#include "matching/order.hpp"
#include <stdexcept>

namespace matching {

    Order::Order(OrderId id_,
        UserId user_,
        Side side_,
        Price price_,
        Qty qty_,
        std::uint64_t seq_)
        : id(id_),
        user(user_),
        side(side_),
        price(price_),
        qty_remaining(qty_),
        seq(seq_)
    {
        // Safety check
        if (qty_remaining <= 0) {
            throw std::invalid_argument("Order qty must be > 0");
        }
    }

} // namespace matching
