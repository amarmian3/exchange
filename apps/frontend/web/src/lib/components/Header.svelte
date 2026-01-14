<script lang="ts">
	let activeLink = 'Marketplace';
	
	const navLinks = [
		{ name: 'Marketplace', href: '/marketplace' },
		{ name: 'Portfolios', href: '/portfolios' },
		{ name: 'Learn', href: '/learn' },
		{ name: 'Company', href: '/company' }
	];

</script>

<header class="border-b border-estate-border bg-black">
	<div class="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-28">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo and Navigation -->
			<div class="flex items-center gap-8">
				<!-- Logo image -->
				<a href="/" class="flex items-center gap-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-estate-orange">
						<svg width="20" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M4.16666 16.1667V10.3333H5.83332V16.1667H4.16666ZM9.16666 16.1667V10.3333H10.8333V16.1667H9.16666ZM1.66666 19.5V17.8333H18.3333V19.5H1.66666ZM14.1667 16.1667V10.3333H15.8333V16.1667H14.1667ZM1.66666 8.66667V7L9.99999 2.83333L18.3333 7V8.66667H1.66666ZM5.37499 7H9.99999H14.625H5.37499ZM5.37499 7H14.625L9.99999 4.70833L5.37499 7Z" fill="white"/>
						</svg>
					</div>
                    <!---Logo Text-->
					<div class="text-xl font-bold leading-7 tracking-tight">
						<span class="text-crusta">ESTATE</span><span class="text-crusta">TOKEN</span>
					</div>
				</a>

				<!-- Desktop Navigation -->
				<nav class="text-white hidden items-center gap-6 md:flex">
					{#each navLinks as link}
						<a 
							href={link.href} 
							class="text-sm font-medium leading-5 transition-colors hover:text-crusta {activeLink === link.name ? 'text-crusta' : 'text-estate-muted'}"
						>
							{link.name}
						</a>
					{/each}
				</nav>
			</div>

			<!-- Auth Buttons -->
			<div class="flex items-center gap-6 text-white">
				<button class="hidden text-sm font-medium leading-5 text-estate-text transition-colors hover:text-crusta sm:block">
					Log In
				</button>
				<button class="overflow-hidden rounded-full bg-crusta px-5 py-2 text-sm font-semibold leading-5 text-white transition-all hover:bg-opacity-90">
					Sign Up
				</button>
			</div>
		</div>
	</div>
</header>
