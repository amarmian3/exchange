#pragma once

#include <cstddef>
#include <cstdint>

#pragma once
#include <cstddef>
#include <cstdint>

#if defined(_WIN32)
#if defined(ME_BUILD_DLL)
#define ME_API extern "C" __declspec(dllexport)
#else
#define ME_API extern "C" __declspec(dllimport)
#endif
#else
#define ME_API extern "C"
#endif

ME_API void* me_create();
ME_API void  me_destroy(void* engine);

ME_API int me_place_limit(void* engine,
    const char* symbol,
    const char* user,
    int side,
    std::int64_t price,
    std::int64_t qty,
    char** out_json,
    std::size_t* out_len);

ME_API int me_cancel(void* engine,
    const char* symbol,
    std::uint64_t order_id,
    char** out_json,
    std::size_t* out_len);

ME_API void me_free(char* p);

ME_API int me_show_orderbook(void* engine,
    const char* symbol,
    char** out_json,
    std::size_t* out_len);



#ifdef __cplusplus
extern "C" {
#endif

    void* me_create();
    void  me_destroy(void* engine);

    // side: 0 = Bid, 1 = Ask
    int me_place_limit(void* engine,
        const char* symbol,
        const char* user,
        int side,
        std::int64_t price,
        std::int64_t qty,
        char** out_json,
        std::size_t* out_len);

    int me_cancel(void* engine,
        const char* symbol,
        std::uint64_t order_id,
        char** out_json,
        std::size_t* out_len);

    int me_show_orderbook(void* engine,
        const char* symbol,
        char** out_json,
        std::size_t* out_len);

    void me_free(char* p);

#ifdef __cplusplus
}
#endif
