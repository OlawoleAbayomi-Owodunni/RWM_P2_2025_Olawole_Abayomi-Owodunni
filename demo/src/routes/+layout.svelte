<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { MobileNav } from '../components/MobileNav';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="top-nav">
	<div class="nav-container">
		<div class="nav-logo">
			<h2>Stats Visualizer</h2>
		</div>
		<ul class="nav-links">
			<li>
				<a href="/streak" class:active={$page.url.pathname === '/streak' || $page.url.pathname === '/'}>
					Motivation
				</a>
			</li>
			<li>
				<a href="/stats" class:active={$page.url.pathname === '/stats'}>
					Analytics
				</a>
			</li>
		</ul>
	</div>
</nav>

{@render children()}

<MobileNav />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	:global(main) {
		padding-bottom: 0;
	}

	@media (max-width: 640px) {
		:global(main) {
			padding-bottom: 80px;
		}
	}

	.top-nav {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
	}

	.nav-logo h2 {
		color: white;
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.nav-links {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 2rem;
	}

	.nav-links a {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		transition: all 0.3s ease;
		display: inline-block;
	}

	.nav-links a:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	.nav-links a.active {
		color: white;
		background: rgba(255, 255, 255, 0.2);
		border-bottom: 2px solid white;
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 0.75rem 1rem;
		}

		.nav-logo h2 {
			font-size: 1.2rem;
		}

		.nav-links {
			gap: 1rem;
		}

		.nav-links a {
			padding: 0.4rem 0.8rem;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 640px) {
		.top-nav {
			display: none;
		}
	}
</style>
