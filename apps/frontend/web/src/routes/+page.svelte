<script lang="ts">
	import { reveal } from '$lib/actions/reveal' // Import the reveal action
	import FAQ from '$lib/components/FAQ.svelte';

	let name = $state('');
	let email = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		// Handle form submission
		console.log('Form submitted:', { name, email });
	}

	// Feature cards data
	const features = [
		{
			icon: 'shield',
			title: 'Privacy First',
			description:
				'Ensure data security with our privacy-centric approach to API management, keeping your sensitive information under strict control.'
		},
		{
			icon: 'grid_on',
			title: 'Scalable',
			description:
				'Seamlessly adapt to your evolving API needs, ensuring efficiency and performance at any scale without bottlenecks.'
		},
		{
			icon: 'swap_horiz',
			title: 'Migration',
			description:
				'Effortlessly transition with robust tools designed for smooth API migration processes, minimizing downtime and complexity.'
		},
		{
			icon: 'schedule',
			title: 'Job Management',
			description:
				'Schedule recurring tasks effortlessly with our intuitive job management interface, automating your routine operations.'
		},
	];

	// Early access cards data
	const earlyAccessFeatures = [
		{
			icon: 'rocket_launch',
			iconColor: 'text-azure-68',
			title: 'Early advantage',
			description: 'Get first-mover access to powerful AI tools before the rest of the market catches on.'
		},
		{
			icon: 'bolt',
			iconGradient: true,
			title: 'Boosted productivity',
			description:
				'Streamline research, automate tasks, and make data-driven decisions faster than ever.'
		},
		{
			icon: 'loop',
			iconColor: 'text-violet-75',
			title: 'Exclusive feedback loop',
			description: 'Shape the future of Gentheri by sharing your insights during early access.'
		}
	];	

	//Step-by-step: Step 1 Cards Data
	interface InvestmentCard {
		id: number;
		title: string;
		index: string;
		yield: string;
		image: string;
		alt: string;
	}

	const investmentCards: InvestmentCard[] = [
		{
			id: 1,
			title: 'Dubai Residential - High Yield',
			index: 'Index • DBI-H',
			yield: '14.2%',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/93e7d7b07b8e5ad64d0d2e8d2ae0c16d10dd40e5?width=892',
			alt: 'Futuristic Dubai skyscrapers reaching into the sky'
		},
		{
			id: 2,
			title: 'Dubai Residential - Low Yield',
			index: 'Index • DBI-L',
			yield: '6.8%',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/ef641708ecffdaa93735a299270806f94a3878a1?width=892',
			alt: 'Luxury low-rise residential complex in Dubai with pools'
		},
		{
			id: 3,
			title: 'Abu Dhabi Residential',
			index: 'Index • AUH-M',
			yield: '9.1%',
			image: 'https://api.builder.io/api/v1/image/assets/TEMP/d16860c3ee2a8998da483eddc5c4b99da484b014?width=892',
			alt: 'Modern Abu Dhabi architecture skyline near water'
		}
	];

		interface IncomeCard {
		name: string;
		image: string;
		percentage: string;
		monthly: string;
		rowAlign: string;
		imageFirst: boolean;
		fontWeight?: 'font-bold' | 'font-medium';
	}

	const incomecards: IncomeCard[] = [
		{
			name: 'New York City',
			image:
				'https://api.builder.io/api/v1/image/assets/TEMP/82e30e6506285ec8e91baa4880dca1c36594075b?width=416',
			percentage: '+8.2%',
			monthly: '$2.9k/mo',
			rowAlign: 'justify-between',
			imageFirst: true,
			fontWeight: 'font-bold'
		},
		{
			name: 'Tokyo City',
			image:
				'https://api.builder.io/api/v1/image/assets/TEMP/f26618b3eb6015aa703311bb118c3f8a535183cd?width=480',
			percentage: '+12.1%',
			monthly: '$1.4k/mo',
			rowAlign: 'justify-start lg:transalte-x-24',
			imageFirst: false,
			fontWeight: 'font-bold'
		},
		{
			name: 'London City',
			image:
				'https://api.builder.io/api/v1/image/assets/TEMP/324477c9c00725ace6271624c556cf31386d4bb9?width=352',
			percentage: '+15.4%',
			monthly: '$1.5k/mo',
			rowAlign: 'justify-between',
			imageFirst: true,
			fontWeight: 'font-bold'
		}
	];

</script>

<style>
  /* Scroll reveal base */
  .reveal {
    opacity: 0;
    transform: translateY(18px) scale(0.99);
    filter: blur(6px);
    transition:
      opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1),
      transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1),
      filter 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: opacity, transform, filter;
  }

  .reveal.is-revealed {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal {
      opacity: 1;
      transform: none;
      filter: none;
      transition: none;
    }
  }
  /* Ensure proper gradient rendering */
	.bg-clip-text {
		-webkit-background-clip: text;
		background-clip: text;
	}
</style>



<div class="relative overflow-hidden min-h-screen bg-black">
	<div class="flex flex-col gap-[120px]">

		<!-- HERO SECTION -->
		<section class="relative overflow-hidden flex min-h-[720px] lg:min-h-[900px] 2xl:min-h-[1000px] items-center w-full bg-azure-8">
			<!-- Background Image -->
			<div class="absolute inset-0 z-0">
				<img
					src="burj_2.png"
					alt=""
					class="absolute inset-0 h-full w-full object-cover object-[60%_35%]"
				/>
				<!-- Gradients -->
				<div class="absolute inset-0 bg-gradient-dark-horizontal"></div>
				<div class="absolute inset-0 bg-gradient-dark-vertical"></div>
			</div>
			<!--Outer Content Grid-->
			<div class="relative w-full px-7 pt-32 pb-16 md:px-14 md:pt-32 md:pb-20 lg:px-28 lg:pt-40 lg:pb-24">
				<!--Content Grid-->
				<div class="relative z-10 mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
					<!-- Left Column -  -->
					<div class="flex flex-col gap-6">
						<!-- Badge -->
						<div
							class="inline-flex w-fit items-center gap-2 rounded-full border border-crusta/30 bg-crusta/10 px-3 py-1"
						>
							<span
								class="bg-gradient-orange bg-clip-text text-xs font-semibold uppercase leading-4 tracking-caps text-transparent"
							>
								Launching Soon
							</span>
						</div>

						<!-- Main Heading -->
						<h1
							class="font-inter text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-[72px] lg:leading-[72px] lg:tracking-[-1.8px]"
						>
							<span class="text-white">Invest in World-<br />Class<br /></span>
							<span class="bg-gradient-orange-alt bg-clip-text text-transparent">Global Cities</span>
						</h1>

						<!-- Description -->
						<div class="max-w-xl">
							<p class="font-inter text-lg leading-[22.5px] text-white lg:text-xl lg:leading-7">
								Unlock fractional ownership in prime real estate markets like Dubai, New York, and London.
								Start building a borderless portfolio today.
							</p>
						</div>
					</div>

					<!-- Right Column - Waitlist Form (push to the right like Code 2) -->
					<div class="relative">
						<div
							class="rounded-2xl border border-azure-27 bg-[rgba(25,44,49,0.50)] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-sm w-full max-w-[580px]"
						>
							<!-- Form Header -->
							<h2 class="mb-6 font-inter text-2xl font-bold leading-8 text-white">Join waitlist</h2>

							<!-- Form -->
							<form onsubmit={handleSubmit} class="flex flex-col gap-6">
								<!-- Name Field -->
								<div class="flex flex-col gap-1">
									<label for="name" class="font-inter text-sm font-medium leading-5 text-azure-84">
										Name
									</label>
									<input
										id="name"
										type="text"
										bind:value={name}
										placeholder="John Doe"
										class="w-full rounded-lg border border-azure-34 bg-cyan-8 px-4 py-3.5 font-inter text-base text-white placeholder-grey-46 outline-none transition-colors focus:border-orange-primary"
									/>
								</div>

								<!-- Email Field -->
								<div class="flex flex-col gap-1">
									<label for="email" class="font-inter text-sm font-medium leading-5 text-azure-84">
										Email
									</label>
									<input
										id="email"
										type="email"
										bind:value={email}
										placeholder="johndoe@example.com"
										class="w-full rounded-lg border border-azure-34 bg-cyan-8 px-4 py-3.5 font-inter text-base text-white placeholder-grey-46 outline-none transition-colors focus:border-orange-primary"
									/>
								</div>

								<!-- Submit Button -->
								<button
									type="submit"
									class="flex items-center justify-center gap-2 self-stretch rounded-lg bg-crusta px-6 py-3 font-inter text-base font-semibold leading-6 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-all hover:bg-orange-primary/90"
								>
									<span>Get early access</span>
									<span class="font-['Material_Icons'] text-sm leading-5">arrow_forward</span>
								</button>
							</form>

							<!-- Social Proof -->
							<div class="mt-6 flex items-center gap-3">
								<!-- User Avatars -->
								<div class="flex items-center -space-x-2">
									<img
										src="https://api.builder.io/api/v1/image/assets/TEMP/55d516ebd4cdbcf7b0353ffd8e29c209d20d2b6b?width=64"
										alt="User"
										class="h-8 w-8 rounded-full border-2 border-[rgba(25,44,49,0.50)]"
									/>
									<img
										src="https://api.builder.io/api/v1/image/assets/TEMP/e42791c09187fae27c6c6f0a467a4898500c7792?width=64"
										alt="User"
										class="h-8 w-8 rounded-full border-2 border-[rgba(25,44,49,0.50)]"
									/>
									<img
										src="https://api.builder.io/api/v1/image/assets/TEMP/0d166f10a10770207cf76788e97a2e830e5a65ff?width=64"
										alt="User"
										class="h-8 w-8 rounded-full border-2 border-[rgba(25,44,49,0.50)]"
									/>
								</div>

								<!-- Text -->
								<span
									class="bg-gradient-orange bg-clip-text font-inter text-sm font-medium leading-5 text-transparent"
								>
									Join 20k others
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Step-by-Step -->
		<div class="flex flex-col gap-[40px]">
			<!-- Step 1 - Buy Indexes-->
			<div class="pb-40 mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">
				<!-- Left Content Section -->
				<div class="flex w-full flex-1 flex-col items-center text-center gap-6 lg:items-start lg:text-left">
					<!-- Badge -->
					<div class="flex h-12 w-12 items-center justify-center rounded-lg border border-ebony-clay bg-timber-green">
						<span class="font-inter text-[20px] leading-[28px] font-bold text-white">1</span>
					</div>

					<!-- Heading -->
					<h1 class="font-inter text-[36px] leading-[40px] font-bold text-white">Buy High-Growth Indexes</h1>

					<!-- Description -->
					<p class="font-inter text-[18px] leading-[29.25px] text-gray-chateau max-w-xl mx-auto lg:max-w-none lg:mx-0">
						Buy fractional ownership in top-performing market indexes across the globe. Choose from
						tech giants to green energy funds instantly.
					</p>

					<!-- Features List -->
					<div class="flex flex-col gap-6 pt-2">
						{#each features as feature}
							<div class="flex items-center gap-3">
								<span class="material-icons text-2xl text-pizazz">check_box</span>
								<span class="font-inter text-[16px] leading-[24px] text-mischka">{feature}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Right Cards Section -->
				<div class="relative flex w-full max-w-md flex-1 flex-col">
					<div class="relative h-[674px] w-full">
						{#each investmentCards as card, index}
							<div
								class="absolute w-full transition-all duration-300 hover:z-10"
								style="top: {index * 250}px; z-index: {3 - index}"
							>
								<div class="flex flex-col gap-6 rounded-3xl border border-azure-27 bg-azure-15 p-0 shadow-card">
									<!-- Card Image -->
									<div class="overflow-hidden rounded-t-3xl">
										<img
											src={card.image}
											alt={card.alt}
											class="h-full w-full object-cover"
											loading="lazy"
										/>
									</div>

									<!-- Card Content -->
									<div class="flex items-start justify-between gap-4 px-6 pb-6">
										<div class="flex flex-col gap-0">
											<h3 class="font-inter text-[18px] leading-[28px] font-bold text-white">
												{card.title}
											</h3>
											<p class="font-inter text-[12px] leading-[16px] text-slate-gray">
												{card.index}
											</p>
										</div>

										<div class="flex flex-col items-end gap-0">
											<span class="font-inter text-[16px] leading-[24px] font-bold text-azure-radiance">
												{card.yield}
											</span>
											<span class="font-inter text-[12px] leading-[16px] text-slate-gray">Yield</span>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Step 2 - Buy Indexes-->
			<!-- Container -->
			<div class="relative mx-auto max-w-7xl">
				<div class="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-16 lg:items-start">
					<!-- Left side - City images with stats -->
					<div class="relative w-full lg:w-1/2 flex-shrink-0">
						<div class="relative h-[500px] sm:h-[600px] lg:h-[674px]">
							{#each incomecards as card (card.name)}
								<!-- ROW: controls zig-zag horizontal placement -->
								<div class={`flex items-center justify-center lg:${card.rowAlign}`}>
									<!-- GROUP: controls order (imageFirst vs pillFirst) -->
									<div
										class={`flex items-center gap-4 sm:gap-8 flex-nowrap ${
											card.imageFirst ? '' : 'flex-row-reverse'
										}`}
									>
										<!-- Circle image -->
										<div class="w-36 h-36 sm:w-34 sm:h-34 lg:w-36 lg:h-36 rounded-full border-4 sm:border-8 border-black shadow-2xl overflow-hidden flex-none">
											<img src={card.image} alt={card.name} class="w-full h-full object-cover" />
										</div>

										<!-- Pill -->
										<div class="flex items-center gap-2 px-4 py-3 sm:py-4 bg-white rounded-3xl border border-grey-96 shadow-xl whitespace-nowrap flex-none">
											<span class="text-spring-green-45 font-bold text-lg sm:text-20px leading-28px tracking--0.5px">
												{card.percentage}
											</span>
											<span
												class={`text-azure-65 ${card.fontWeight} text-lg sm:text-20px leading-28px tracking--0.5px`}
											>
												{card.monthly}
											</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Right side - Content -->
					<div class="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left gap-6 lg:gap-24 mt-8 lg:mt-0">
						<!-- Step badge -->
						<div class="flex h-12 w-12 items-center justify-center rounded-lg border border-ebony-clay bg-timber-green">
							<span class="text-white text-center font-bold text-20px leading-28px">2</span>
						</div>

						<!-- Heading -->
						<h2 class="text-white font-bold text-3xl sm:text-36px leading-40px">
							Receive Passive Income
						</h2>

						<!-- Description -->
						<p class="text-azure-65 font-normal text-lg sm:text-18px leading-29.25px max-w-xl mx-auto lg:max-w-none lg:mx-0">
							Earn dividends automatically from your index holdings. Payouts are distributed directly
							to your wallet on a flexible schedule. Reinvest to compound.
						</p>

						<!-- Stats cards -->
						<div class="flex flex-col sm:flex-row gap-6 pt-2 w-full">
							<!-- Avg Yield card -->
							<div class="flex-1 flex flex-col gap-1 p-4 rounded-8px border border-white-10 bg-grey-7">
								<span class="text-grey-46 font-normal text-14px leading-20px">Avg. Yield</span>
								<span class="text-orange-50 font-bold text-24px leading-32px">8-12%</span>
							</div>

							<!-- Frequency card -->
							<div class="flex-1 flex flex-col gap-1 p-4 rounded-8px border border-white-10 bg-grey-7">
								<span class="text-grey-46 font-normal text-14px leading-20px">Frequency</span>
								<span class="text-white font-bold text-24px leading-32px">Monthly</span>
							</div>
						</div>

						<!-- Features list -->
						<div class="flex flex-col gap-3 pt-2">
							<!-- Feature 1 -->
							<div class="flex items-center gap-3 p-3 rounded-4px">
								<span class="text-orange-50 font-icons text-20px leading-28px material-icons">
									refresh
								</span>
								<span class="text-azure-84 font-normal text-16px leading-24px">
									Automated dividend reinvestment (DRIP)
								</span>
							</div>

							<!-- Feature 2 -->
							<div class="flex items-center gap-3 p-3 rounded-4px">
								<span class="text-orange-50 font-icons text-20px leading-28px material-icons">
									description
								</span>
								<span class="text-azure-84 font-normal text-16px leading-24px">
									Automated tax-loss harvesting
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Step 3 - Sell Anytime -->
			<section class="w-full flex items-center pb-20">
				<div class="w-full px-6">
					<div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row lg:items-center lg:gap-16">
					
						<!-- Left Content Section -->
						<div class="flex w-full flex-1 flex-col items-center text-center gap-6 lg:items-start lg:text-left">
							<div class="flex h-12 w-12 items-center justify-center rounded-lg border border-ebony-clay bg-timber-green">
							<span class="font-inter text-[20px] leading-[28px] font-bold text-white">3</span>
							</div>

							<h1 class="font-inter text-[36px] leading-[40px] font-bold text-white">Sell Anytime</h1>

							<p class="font-inter text-[18px] leading-[29.25px] text-gray-chateau max-w-xl">
							Buy fractional ownership in top-performing market indexes across the globe. Choose from
							tech giants to green energy funds instantly.
							</p>
						</div>
						<!-- Right Image Section -->
						<div class="flex w-full flex-1 items-center justify-center">
							<img
							src="/resi_index_view.png"
							alt="Product Beta Dashboard Preview"
							class="w-full max-w-[560px] h-auto"
							/>
						</div>
					</div>
				</div>
			</section>
		</div>


	
		<!-- Product Beta -->
		<section class="flex flex-col items-center justify-center gap-[120px] px-5 md:px-20 reveal"
			use:reveal={{ delay: 100 }}>
			<div class="flex w-full max-w-container flex-col items-center gap-xl px-4 md:px-8">
				<!-- Heading Container -->
				<div class="flex w-full flex-col items-center gap-6">
					<!-- Main Heading -->
					<div class="flex flex-col items-center">
						<h1 class="text-center font-sans text-[48px] font-bold leading-[48px] text-crusta">
							Product Beta
						</h1>
					</div>
					
					<!-- Subtitle -->
					<div class="flex w-full max-w-text flex-col items-center">
						<p class="text-center text-lg leading-28 text-white md:text-18">
							Fuel your curiosity, expand your horizons, and achieve greatness by joining a vibrant
							community of learners.
						</p>
					</div>
				</div>
			</div>
			
			<!-- Image -->
			<img 
				src="/resi_index_view.png"
				alt="Product Beta Dashboard Preview" 
				style="width:800px;"
			/>
		</section>

		<!-- Features Section -->
		<section class="w-full px-5 py-[20px] md:px-20 reveal"
			use:reveal={{ delay: 100 }}>
			<div class="mx-auto max-w-1280 px-8">
				<!-- Section Header -->
				<div class="mb-20 flex flex-col items-center gap-6">
					<h2 class="text-center text-5xl font-bold leading-[48px] text-crusta md:text-48">
						Features
					</h2>
					<div class="max-w-672">
						<p class="text-center text-lg leading-28 text-white md:text-18">
							Improve your API experience with privacy, scalability, migration tools, job management,
							CLI support, and cutting-edge experimental features.
						</p>
					</div>
				</div>

				<!-- Feature Cards Grid -->
				<div class="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/20">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each features as feature}
							<div class="relative rounded-2xl border border-white/10 bg-timber-green/50 p-10 min-h-[220px] transition-colors duration-300 hover:bg-white/[0.03]">
								<!-- Gradient Overlay -->
								<div
									class="pointer-events-none absolute inset-0 rounded-16 opacity-40"
									style="background: linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0.26%, rgba(0, 0, 0, 0.00) 0.26%), linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0.4%, rgba(0, 0, 0, 0.00) 0.4%)"
								></div>

								<!-- Content -->
								<div class="relative z-10">
									<!-- Icon -->
									<div
										class="mb-6 flex h-14 w-14 items-center justify-center rounded-12 bg-orange-6010"
									>
										<span class="material-icons text-2xl text-crusta">{feature.icon}</span>
									</div>
									<!-- Title -->
									<h3 class="mb-3 text-xl font-bold leading-28 text-white">{feature.title}</h3>
									<!-- Description -->
									<p class="text-sm leading-[22.75px] text-white">{feature.description}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<!-- Section: What You Get Early Access To Section -->
		<section class="w-full px-5 md:px-20 reveal"
			use:reveal={{ delay: 100 }}>
			<div class="mx-auto max-w-1280 px-8">
				<!-- Section Header -->
				<div class="mb-16 flex flex-col items-center gap-6">
					<h2 class="text-center text-5xl font-bold leading-[48px] text-crusta md:text-48">
						What you get <br class="hidden sm:inline" /> early access to
					</h2>
				</div>

				<!-- What you get early Access to Cards Grid -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each earlyAccessFeatures as feature}
						<div
							class="relative flex flex-col rounded-12 bg-timber-green/50 p-6 shadow-card-early transition-transform hover:scale-105"
						>
							<!-- Icon Background -->
							<div class="mb-6 flex h-10 w-10 items-center justify-center rounded-8 bg-azure-17">
								{#if feature.iconGradient}
									<span
										class="material-icons bg-gradient-crusta bg-clip-text text-2xl"
										style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;"
										>{feature.icon}</span
									>
								{:else}
									<span class="material-icons text-2xl {feature.iconColor}">{feature.icon}</span>
								{/if}
							</div>

							<!-- Title -->
							<h3 class="mb-3 text-lg font-bold leading-28 text-white">{feature.title}</h3>

							<!-- Description -->
							<p class="text-sm leading-20 text-white">{feature.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- FAQ section -->
		<div class="w-full reveal"
			use:reveal={{ delay: 100 }}>
			<FAQ />
		</div>
	</div>
</div>

<!-- Feature Cards Grid OLD  -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature}
				<div
					class="group relative flex flex-col rounded-16 border border-azure-17 bg-gray-chateau p-8 shadow-card-features transition-transform hover:scale-105"
				>
					<!-- Gradient Overlay -->
					<div
						class="pointer-events-none absolute inset-0 rounded-16 opacity-40"
						style="background: linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0.26%, rgba(0, 0, 0, 0.00) 0.26%), linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0.4%, rgba(0, 0, 0, 0.00) 0.4%)"
					></div>

					<!-- Content -->
					<div class="relative z-10">
						<div class="mb-6 flex h-14 w-14 items-center justify-center rounded-12 bg-orange-6010">
							<span class="material-icons text-2xl text-crusta">{feature.icon}</span>
						</div>

						<h3 class="mb-3 text-xl font-bold leading-28 text-white">
							{feature.title}
						</h3>

						<p class="text-sm leading-[22.75px] text-white">
							{feature.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
