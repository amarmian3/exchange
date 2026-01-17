<script>
	import InvestmentCard from '$lib/components/InvestmentCard.svelte';
	
	let searchQuery = '';
	let activeFilter = 'All';
	
	const filters = ['All', 'Residential', 'Residential Index', 'High Yield', 'Income Focused', 'Available Only'];
	
	const investments = [
		{
			tier: 'Premier Tier',
			title: 'Dubai Residential Index',
			description: 'Prime residential towers in Downtown & Marina',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/e969da72899c109014009327f780a90d5e8f3a91?width=764',
			investors: '1,248',
			netAssets: '$14.2M',
			targetYield: '8-12%',
			available: true,
            href: '/dubai_resi'
		},
		{
			tier: 'High Yield',
			title: 'Abu Dhabi Growth Fund',
			description: 'Diversified portfolio across Al Reem & Yas Island',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/c77771772bb22a13b2f256ece967b9a6c97eee06?width=764',
			investors: '842',
			netAssets: '$8.9M',
			targetYield: '7.2%',
			available: true,
		},
		{
			tier: 'Growth Focus',
			title: 'Riyadh Expansion Index',
			description: 'Targeting Saudi Vision 2030 development zones',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/3ee87e53e5d57bdf2e0fefc135f5928e510772d4?width=764',
			investors: '2.1K',
			netAssets: '$21.5M',
			targetYield: '9.1%',
			available: true, 
		}
	];
</script>

<div class="mx-auto max-w-screen-2xl px-4 py-16 sm:px-8 lg:px-28">
	<div class="flex flex-col gap-10">
		<!-- Header Section -->
		<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
			<!-- Title -->
			<div class="flex flex-col gap-2">
				<h1 class="text-white text-48 font-bold tracking-tight-hero">
					Explore Indexes
				</h1>
				<p class="text-body-lg text-azure-65">
					Invest in curated regional real estate portfolios
				</p>
			</div>

			<!-- Search bar -->
			<div class="relative flex-1 lg:max-w-md">
				<div class="absolute left-3 top-1/2 -translate-y-1/2">
					<svg width="20" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M16.3333 19.5L11.0833 14.25C10.6667 14.5833 10.1875 14.8472 9.64583 15.0417C9.10417 15.2361 8.52778 15.3333 7.91667 15.3333C6.40278 15.3333 5.12153 14.809 4.07292 13.7604C3.02431 12.7118 2.5 11.4306 2.5 9.91667C2.5 8.40278 3.02431 7.12153 4.07292 6.07292C5.12153 5.02431 6.40278 4.5 7.91667 4.5C9.43056 4.5 10.7118 5.02431 11.7604 6.07292C12.809 7.12153 13.3333 8.40278 13.3333 9.91667C13.3333 10.5278 13.2361 11.1042 13.0417 11.6458C12.8472 12.1875 12.5833 12.6667 12.25 13.0833L17.5 18.3333L16.3333 19.5Z" fill="#94A3B8"/>
					</svg>
				</div>
				<input 
					type="text" 
					bind:value={searchQuery}
					placeholder="Search indexes, cities, or asset types..."
					class="w-full overflow-hidden rounded-xl border border-white-10 bg-azure-11 py-3 pl-12 pr-4 text-sm leading-normal text-grey-96 placeholder-azure-65 outline-none transition-colors focus:border-crusta"
				/>
			</div>
		</div>

		<!-- Filters & Sort -->
		<div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap gap-2">
                {#each filters as filter}
                    <button
                        onclick={() => activeFilter = filter}
                        class="px-6 py-3 rounded-full text-sm transition-all font-medium
                            {activeFilter === filter
                                ? 'bg-grey-96 text-azure-8'
                                : 'border border-white-10 text-grey-96 hover:border-crusta'}"
                    >
                        {filter}
                    </button>
                {/each}
            </div>
            <!-- Filter icon Button -->
			<button class="ml-auto flex items-center gap-2 px-5 py-3 rounded-12 border border-white-10 text-azure-65 hover:border-crusta">
				<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.8989 11.3335V10.2224H8.12112V11.3335H5.8989ZM3.67668 8.55572V7.44461H10.3433V8.55572H3.67668ZM2.01001 5.77794V4.66683H12.01V5.77794H2.01001Z" fill="currentColor"/>
				</svg>
				<span class="text-label">Filter</span>
			</button>
		</div>

		<!-- Investment Cards Grid -->
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each investments as investment}
				<InvestmentCard {...investment} />
			{/each}
		</div>
	</div>
</div>