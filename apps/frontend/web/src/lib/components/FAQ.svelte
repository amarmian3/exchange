<script lang="ts">
  import { slide } from "svelte/transition"
  import { cubicOut } from "svelte/easing"

  interface FAQItem {
    question: string
    answer?: string
    isOpen?: boolean
  }

  let faqItems: FAQItem[] = $state([
    { question: "How much time do I need each week?", answer: "Add your answer here", isOpen: false },
    { question: "Do I need a tech or coding background?", answer: "Add your answer here", isOpen: false },
    { question: "What makes this better than free tutorials?", answer: "Add your answer here", isOpen: false },
    { question: "Can I take a break if life gets busy?", answer: "Add your answer here", isOpen: false },
    { question: "Will I get all course updates for free?", answer: "Add your answer here", isOpen: false }
  ])

  function toggleFAQ(index: number) {
    faqItems[index].isOpen = !faqItems[index].isOpen
  }
</script>

<section class="px-4 py-16 md:py-24">
  <div class="mx-auto max-w-3xl px-4 sm:px-8">
    <div class="mb-12 flex flex-col items-center gap-4 md:mb-16">
      <h2 class="text-center font-inter text-4xl font-bold leading-tight text-crusta md:text-5xl lg:text-[48px] lg:leading-[48px]">
        Frequently Asked<br class="hidden sm:inline" />
        Questions
      </h2>
    </div>

    <div class="flex flex-col gap-1">
      {#each faqItems as item, index}
        <div class="group text-white rounded-lg bg-timber-green/50">
          <button
            type="button"
            class="flex w-full items-center justify-between px-5 py-5 text-left transition-opacity duration-200 hover:opacity-85"
            aria-expanded={item.isOpen}
            onclick={() => toggleFAQ(index)}
          >
            <span class="font-inter font-medium leading-6 text-athens-gray">
              {item.question}
            </span>

            <svg
              class="h-6 w-6 transition-transform duration-300"
              style:transform={`rotate(${item.isOpen ? 45 : 0}deg)`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 12H18" stroke="#E5E7EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 18V6" stroke="#E5E7EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          {#if item.isOpen && item.answer}
            <div
              transition:slide={{
                duration: 650,        // 👈 slower like Framer
                easing: cubicOut
              }}
              class="border-azure-dark px-5 pb-5 pt-4"
            >
              <p class="font-inter text-sm leading-6 text-white">
                {item.answer}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
