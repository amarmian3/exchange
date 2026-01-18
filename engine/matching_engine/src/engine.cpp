#include "matching/engine.hpp"

namespace matching {

    OrderBook& Engine::book_for(const Symbol& symbol) {
        std::unordered_map<Symbol, OrderBook>::iterator it = books_.find(symbol);
        if (it == books_.end()) {
            it = books_.emplace(symbol, OrderBook{ symbol }).first;
        }
        return it->second;
    }

} // namespace matching
