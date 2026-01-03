#pragma once
#include <unordered_map>
#include "matching/book.hpp"

namespace matching {
    class Engine {
    public:
        OrderBook& book_for(const Symbol& symbol);

    private:
        std::unordered_map<Symbol, OrderBook> books_;
    };
}
