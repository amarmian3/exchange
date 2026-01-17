<script lang="ts">
	let activeTimeframe = $state<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');
	let activeTab = $state<'price' | 'yield'>('price');
	let payment = $state('5,000');
	let receive = $state('3.997');
	let tradingMode = $state<'buy' | 'sell'>('buy');

    // Tab navigation data
	const tabs = [
		{ id: 'underlying-assets', label: 'Underlying Assets' },
		{ id: 'order-book', label: 'Order Book' },
		{ id: 'details', label: 'Details' },
		{ id: 'financials', label: 'Financials' },
		{ id: 'history', label: 'History' }
	];

	let activeTabId = 'underlying-assets';

	function handleTabClick(tabId: string) {
		activeTabId = tabId;
	}

	// Property data
	const properties = [
		{
			id: 1,
			name: 'Dubai Downtown',
			type: '2 bed flat',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/c95e5db328f8a73625d801084159bed5b4537af1?width=128',
			marketCap: 'AED 3.12m',
			rentalIncome: '$1.25',
			yield: '9.5%',
			weight: '12.5%',
			status: 'Active',
			chartPath: 'M1 12L10 15L20 8L30 14L40 10L50 16L60 6L79 12'
		},
		{
			id: 2,
			name: 'Business Bay',
			type: '3 bed flat',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/5b1281180a0e998fe3a071a6555a15cebe970247?width=128',
			marketCap: 'AED 1.39m',
			rentalIncome: '$0.95',
			yield: '10.8%',
			weight: '9.8%',
			status: 'Auction',
			chartPath: 'M1 10L15 12L25 18L40 8L55 12L79 5'
		}
	];
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="mx-auto relative min-h-screen max-w-screen-2xl bg-black px-4 py-6 md:px-6 lg:px-8">
	
		<!-- Main Grid Layout -->
		<div class="grid gap-4 lg:grid-cols-[1fr,450px]">
			<!-- Price Chart Section -->
			<div
				class="flex flex-col overflow-hidden rounded-xl border border-azure-20 bg-woodsmoke p-6"
			>
				<!-- Tabs -->
				<div class="mb-6 flex items-center border-b border-azure-20 pb-4">
					<button
						onclick={() => (activeTab = 'price')}
						class="relative pb-4 text-sm font-semibold transition-colors {activeTab === 'price'
							? 'text-crusta'
							: 'text-azure-65'}"
					>
						Price Chart
						{#if activeTab === 'price'}
							<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-crusta"></div>
						{/if}
					</button>
					<button
						onclick={() => (activeTab = 'yield')}
						class="ml-6 pb-4 text-sm font-semibold text-azure-65 transition-colors hover:text-slate-gray"
					>
						Yield History
					</button>

					<!-- Timeframe Selector -->
					<div class="ml-auto flex gap-1 rounded-lg border border-azure-20/50 bg-azure-27/30 p-1">
						{#each ['1D', '1W', '1M', '1Y', 'ALL'] as timeframe}
							<button
								onclick={() => (activeTimeframe = timeframe)}
								class="rounded-md px-3 py-1 text-xs font-bold transition-all {activeTimeframe ===
								timeframe
									? 'bg-crusta text-white'
									: 'text-slate-gray hover:text-azure-65'}"
							>
								{timeframe}
							</button>
						{/each}
					</div>
				</div>

				<!-- Price Display -->
				<div class="mb-6 flex items-center gap-4">
					<h1 class="text-4xl font-bold text-grey-96">AED 1,250.75</h1>
					<span class="rounded-lg bg-orange-503 px-3 py-1 text-sm font-bold text-spring-green-45">
						+5.2%
					</span>
				</div>

				<!-- Chart -->
				<div class="relative h-[400px] overflow-hidden rounded-lg bg-woodsmoke md:h-[487px]">
					<svg
						class="h-full w-full"
						viewBox="0 0 870 487"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						preserveAspectRatio="none"
					>
						<defs>
							<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#FF8C42" stop-opacity="0.2" />
								<stop offset="100%" stop-color="#FF8C42" stop-opacity="0" />
							</linearGradient>
						</defs>
						<path
							d="M0 454.067C36.25 432.444 72.5 416.228 108.75 405.417C145 394.605 181.25 383.794 217.5 372.983C253.75 362.172 290 345.955 326.25 324.333C362.5 302.711 398.75 275.683 435 243.25C471.25 210.817 507.5 200.005 543.75 210.817C580 221.628 616.25 210.817 652.5 178.383C688.75 145.95 725 135.139 761.25 145.95C797.5 156.761 833.75 145.95 870 113.517V486.5H0V454.067Z"
							fill="url(#chartGradient)"
						/>
						<path
							d="M0 454.067C36.25 432.444 72.5 416.228 108.75 405.417C145 394.606 181.25 383.794 217.5 372.983C253.75 362.172 290 345.956 326.25 324.333C362.5 302.711 398.75 275.683 435 243.25C471.25 210.817 507.5 200.005 543.75 210.817C580 221.628 616.25 210.817 652.5 178.383C688.75 145.95 725 135.139 761.25 145.95C797.5 156.761 833.75 145.95 870 113.517"
							stroke="#FF8C42"
							stroke-width="3"
							vector-effect="non-scaling-stroke"
						/>
					</svg>

					<!-- Time Labels [needs to change dependant on time controls]-->
					<div class="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2 text-xs">
						{#each ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'] as time}
							<span class="font-medium text-azure-65">{time}</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Trading Panel -->
			<div class="flex flex-col overflow-hidden rounded-xl border border-azure-20 bg-woodsmoke">
				<!-- Buy/Sell Toggle -->
				<div class="border-b border-azure-20 p-5">
					<div class="flex gap-1 rounded-lg bg-azure-27/30 p-1">
						<button
							onclick={() => (tradingMode = 'buy')}
							class="flex-1 rounded-md py-2 text-sm font-bold transition-all {tradingMode === 'buy'
								? 'bg-crusta text-white'
								: 'text-slate-gray hover:text-azure-65'}"
						>
							Buy
						</button>
						<button
							onclick={() => (tradingMode = 'sell')}
							class="flex-1 rounded-md py-2 text-sm font-bold transition-all {tradingMode === 'sell'
								? 'bg-crusta text-white'
								: 'text-slate-gray hover:text-azure-65'}"
						>
							Sell
						</button>
					</div>

					<!-- Input Fields -->
					<div class="mt-5 space-y-4">
						<!-- Payment Amount -->
						<div>
							<span class="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-gray">
								Payment Amount
							</span>
							<div class="relative">
								<input
									type="text"
									bind:value={payment}
									class="w-full rounded-lg border border-azure-27 bg-transparent px-4 py-3 text-lg font-medium text-white focus:border-crusta focus:outline-none focus:ring-1 focus:ring-crusta"
								/>
								<span
									class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-azure-65"
								>
									USDC
								</span>
							</div>
						</div>

						<!-- Receive Amount -->
						<div>
							<span class="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-gray">
								Receive (Estimated)
							</span>
							<div class="relative">
								<input
									type="text"
									bind:value={receive}
									class="w-full rounded-lg border border-azure-27 bg-transparent px-4 py-3 text-lg font-medium text-white focus:border-crusta focus:outline-none focus:ring-1 focus:ring-crusta"
								/>
								<span
									class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-azure-65"
								>
									REI
								</span>
							</div>
						</div>

						<!-- Buy Button -->
						<button
							class="w-full rounded-lg bg-crusta px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-crusta/20 transition-all hover:bg-crusta/90 hover:shadow-xl hover:shadow-crusta/30"
						>
							Buy Index Token
						</button>
					</div>
				</div>

				<!-- Order Book -->
				<div class="flex-1 overflow-hidden p-5">
					<div class="mb-3.5 flex items-center justify-between">
						<h3 class="text-xs font-bold uppercase tracking-wider text-slate-gray">Order Book</h3>
						<svg
							width="18"
							height="22"
							viewBox="0 0 18 22"
							fill="none"
							class="cursor-pointer text-azure-65 hover:text-slate-gray"
						>
							<path
								d="M8.25 17.75V13.25H9.75V14.75H15.75V16.25H9.75V17.75H8.25ZM2.25 16.25V14.75H6.75V16.25H2.25ZM5.25 13.25V11.75H2.25V10.25H5.25V8.75H6.75V13.25H5.25ZM8.25 11.75V10.25H15.75V11.75H8.25ZM11.25 8.75V4.25H12.75V5.75H15.75V7.25H12.75V8.75H11.25ZM2.25 7.25V5.75H9.75V7.25H2.25Z"
								fill="currentColor"
							/>
						</svg>
					</div>

					<!-- Column Headers -->
					<div class="mb-2 grid grid-cols-3 gap-4 px-1 text-[10px] font-bold uppercase text-azure-65">
						<div>Price (AED)</div>
						<div class="text-right">Size (REI)</div>
						<div class="text-right">Total</div>
					</div>

					<!-- Sell Orders -->
					<div class="mb-2 space-y-0.5">
						{#each [
							{ price: '1,254.30', size: '12.45', total: '15.6k', width: '65%' },
							{ price: '1,253.15', size: '4.20', total: '5.2k', width: '25%' },
							{ price: '1,251.80', size: '1.82', total: '2.2k', width: '13%' }
						] as order}
							<div class="relative grid grid-cols-3 gap-4 rounded px-1 py-1">
								<div
									class="absolute right-0 top-0 h-full bg-red/10"
									style="width: {order.width}"
								></div>
								<div class="relative z-10 text-[11px] font-semibold text-red">
									{order.price}
								</div>
								<div class="relative z-10 text-right text-[11px] text-slate-gray">{order.size}</div>
								<div class="relative z-10 text-right text-[11px] text-slate-gray">{order.total}</div>
							</div>
						{/each}
					</div>

					<!-- Spread -->
					<div
						class="my-2 flex items-center justify-between rounded-lg border-y border-azure-15 bg-azure-27/30 px-3 py-2.5"
					>
						<div>
							<div class="text-[9px] font-bold uppercase text-azure-65">Best Ask</div>
							<div class="text-xs font-bold text-red">1,251.80</div>
						</div>
						<div class="text-center">
							<div class="text-[9px] font-bold uppercase text-azure-65">Spread</div>
							<div class="text-[10px] font-bold text-azure-84">1.05 (0.08%)</div>
						</div>
						<div class="text-right">
							<div class="text-[9px] font-bold uppercase text-azure-65">Best Bid</div>
							<div class="text-xs font-bold text-spring-green-45">1,250.75</div>
						</div>
					</div>

					<!-- Buy Orders -->
					<div class="space-y-0.5">
						{#each [
							{ price: '1,250.75', size: '2.50', total: '3.1k', width: '16%' },
							{ price: '1,249.20', size: '15.00', total: '18.7k', width: '90%' },
							{ price: '1,248.50', size: '8.95', total: '11.1k', width: '49%' }
						] as order}
							<div class="relative grid grid-cols-3 gap-4 rounded px-1 py-1">
								<div
									class="absolute right-0 top-0 h-full bg-spring-green-45/10"
									style="width: {order.width}"
								></div>
								<div class="relative z-10 text-[11px] font-semibold text-spring-green-45">
									{order.price}
								</div>
								<div class="relative z-10 text-right text-[11px] text-slate-gray">{order.size}</div>
								<div class="relative z-10 text-right text-[11px] text-slate-gray">{order.total}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Statistics Cards -->
		<div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
			{#each [
				{ label: 'Number of properties', value: '36', color: 'text-grey-96' },
				{ label: 'Total Investors', value: '5,000+', color: 'text-grey-96' },
				{ label: 'Index Market Cap', value: 'AED 145M', color: 'text-grey-96' },
				{ label: 'Avg. Annual Yield', value: '8.4%', color: 'text-spring-green-45' },
				{ label: '24h Trading Volume', value: 'AED 4.2M', color: 'text-grey-96' }
			] as stat}
				<div class="rounded-xl border border-azure-15 bg-woodsmoke p-4">
					<div
						class="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-gray"
					>
						{stat.label}
					</div>
					<div class="text-2xl font-bold {stat.color}">{stat.value}</div>
				</div>
			{/each}
		</div>

	<!-- Properties Section -->
    <div class="border-b border-white/80 mt-20">
		<nav class="flex items-start overflow-auto">
			{#each tabs as tab, index}
				<button
					type="button"
					onclick={() => handleTabClick(tab.id)}
					class="flex flex-col items-start border-b-2 px-1 py-4 transition-colors {index > 0
						? 'ml-8'
						: ''} {activeTabId === tab.id
						? 'border-crusta'
						: 'border-transparent hover:border-white'}"
					aria-pressed={activeTabId === tab.id}
				>
					<span
						class="text-sm font-medium leading-5 transition-colors {activeTabId === tab.id
							? 'text-crusta'
							: 'text-azure-65 hover:text-white'}"
					>
						{tab.label}
					</span>
				</button>
			{/each}
		</nav>
	</div>

    <!-- Underlying Assets Table (horizontal scroll on smaller screens) -->
    <div class="mt-9">
        <!-- Scroll container -->
        <div class="overflow-x-auto">
            <!-- Force a minimum width so columns don't crush on small screens -->
            <div class="min-w-[1400px] 2xl:min-w-full">
                <!-- Column Headers -->
                <div
                    class="grid items-center gap-4
            grid-cols-[minmax(320px,1.9fr)_minmax(110px,0.7fr)_minmax(100px,0.7fr)_minmax(120px,0.7fr)_minmax(90px,0.6fr)_minmax(90px,0.6fr)_minmax(110px,0.6fr)]"
                >
                    <span class="text-xs font-semibold uppercase tracking-wider text-azure-65">Property</span>
                    <span class="text-right text-xs font-semibold uppercase tracking-wider text-azure-65"
                        >Market cap</span
                    >
                    <span class="text-right text-xs font-semibold uppercase tracking-wider text-azure-65"
                        >30d Chart</span
                    >
                    <span class="text-right text-xs font-semibold uppercase tracking-wider text-azure-65"
                        >Rental Income</span
                    >
                    <span class="text-right text-xs font-semibold uppercase tracking-wider text-azure-65"
                        >Yield %</span
                    >
                    <span class="text-right text-xs font-semibold uppercase tracking-wider text-azure-65"
                        >Weight</span
                    >
                    <span class="text-right text-xs font-semibold uppercase tracking-wider text-azure-65"
                        >Status</span
                    >
                </div>

                <!-- Property Rows -->
                <div class="mt-3 flex flex-col gap-4">
                    {#each properties as property}
                        <div class="grid items-center gap-4 rounded-xl border border-azure-20 bg-woodsmoke px-4 py-4
                            grid-cols-[minmax(320px,1.9fr)_minmax(110px,0.7fr)_minmax(100px,0.7fr)_minmax(120px,0.7fr)_minmax(90px,0.6fr)_minmax(90px,0.6fr)_minmax(110px,0.6fr)]">
                            <!-- Property -->
                            <div class="flex items-center gap-4 min-w-0">
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    class="h-16 w-16 shrink-0 overflow-hidden rounded-lg"
                                />
                                <div class="min-w-0">
                                    <h3 class="truncate text-lg font-bold leading-7 text-white">{property.name}</h3>
                                    <p class="text-sm leading-5 text-azure-65">{property.type}</p>
                                </div>
                            </div>

                            <!-- Market Cap -->
                            <div class="text-right">
                                <span class="text-base font-medium leading-6 text-white">{property.marketCap}</span>
                            </div>

                            <!-- 30d Chart -->
                            <div class="flex justify-end">
                                <svg
                                    class="opacity-70"
                                    width="80"
                                    height="24"
                                    viewBox="0 0 80 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d={property.chartPath}
                                        stroke="#10B981"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>

                            <!-- Rental Income -->
                            <div class="text-right">
                                <span class="text-base font-medium leading-6 text-white">{property.rentalIncome}</span>
                            </div>

                            <!-- Yield % -->
                            <div class="text-right">
                                <span class="text-base leading-6 text-spring-green-45">{property.yield}</span>
                            </div>

                            <!-- Weight -->
                            <div class="text-right">
                                <span class="text-base font-bold leading-6 text-crusta">{property.weight}</span>
                            </div>

                            <!-- Status -->
                            <div class="flex justify-end">
                                <span
                                    class="rounded-full bg-azure-27 px-3 py-1 text-center text-xs font-medium leading-4 text-white"
                                >
                                    {property.status}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
