/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'crusta': '#FC8337',
				'crusta-light': '#FDC19B',
				'crusta-lighter': '#FEE0CD',
				'ebony': '#111827',
				'timber-green': '#192C31',
				'pale-sky': '#6B7280',
				'mischka': '#D1D5DB',
				'azure-27': '#374151',
				'azure-34': '#4B5563',
				'azure-8': '#0B1120', 
				'cyan-8': '#0D181A',
				'main-bg': '#111F22',
				'cyan-10': '#111F22',
				'azure-17': '#1E293B',
				'azure-68': '#60A5FA',
				'gray-chateau': '#1A2C32',
				'violet-75': '#C084FC',
				'orange-6010': 'rgba(252, 131, 55, 0.10)',
				'grey-3': '#080808',
				'ebony-clay': '#23353A',
				'azure-65': '#94A3B8',
				'pizazz': '#FF8A00',
				'mischka': '#CBD5E1',
				'azure-15': '#1A2632',
				'slate-gray': '#64748B',
				'azure-radiance': '#137FEC',
				'white-5': 'rgba(255, 255, 255, 0.05)',
				'grey-2': '#050505',
				'grey-7': '#121212',
				'grey-46': '#6B7280',
				'grey-96': '#F1F5F9',
				'orange-50': '#FF8A00',
				'orange-503': 'rgba(255, 138, 0, 0.03)',
				'spring-green-45': '#22C55E',
				'azure-65': '#94A3B8',
				'azure-84': '#CBD5E1',
				'white-10': 'rgba(255, 255, 255, 0.10)',
				'azure-11':'#161B22',
				'white-bunker': '#0B0E14',
				'woodsmoke': '#151719',
				'azure-20': '#253240',
				'azure-5': '#0B0C0E',
				'cyan-21': '#234248'
			},
			fontFamily: {
				'inter': ['Inter', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
			},
			fontSize: {
				'hero': '72px',
				'48': '48px',
				'20': '20px',
				'18': '18px',
				'14': '14px',
				'display': ['36px', { lineHeight: '40px', fontWeight: '700' }],
				'body-lg': ['18px', { lineHeight: '29.25px', fontWeight: '400' }],
				'heading-3': ['18px', { lineHeight: '28px', fontWeight: '700' }],
				'label': ['16px', { lineHeight: '24px', fontWeight: '400' }],
				'badge': ['20px', { lineHeight: '28px', fontWeight: '700' }],
				'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
				'stat': ['16px', { lineHeight: '24px', fontWeight: '700' }],
			},
			lineHeight: {
				'48': '48px',
				'28': '28px',
				'24': '24px',
				'22.75': '22.75px',
				'20': '20px',
			},
			spacing: {
				'80': '80px',
				'64': '64px',
				'32': '32px',
				'24': '24px',
			},
			borderRadius: {
				'16': '16px',
				'12': '12px',
				'8': '8px',
			},
			maxWidth: {
				'1280': '1280px',
				'672': '672px',
			},
			letterSpacing: {
				'tight-hero': '-1.8px',
				'wide-caps': '1.2px',
				'caps': '0.3px',
			},
			backgroundImage: {
				'gradient-orange': 'linear-gradient(90deg, #FC8337 0%, #FDC19B 50%, #FEE0CD 75%)',
				'gradient-white': 'linear-gradient(90deg, #FFF 0%, #9CA3AF 100%)',
				'gradient-crusta': 'linear-gradient(90deg, #FC8337 0%, #FDC19B 50%, #FEE0CD 75%)',
				'gradient-orange-alt': 'linear-gradient(90deg, #FC8337 0%, #FED7AA 100%)',
				'gradient-dark-horizontal': 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.00) 100%)',
				'gradient-dark-vertical':'linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.95) 100%)'
			},
			boxShadow: {
				'card-waitlist': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'button': '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)',
				'card-features': '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)',
				'card-early': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				'card-index': '0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)'
			},
			blur: {
				'glow': '32px',
			},
			backdropBlur: {
				xs: '6px'
			}
		}
	},
	plugins: []
}