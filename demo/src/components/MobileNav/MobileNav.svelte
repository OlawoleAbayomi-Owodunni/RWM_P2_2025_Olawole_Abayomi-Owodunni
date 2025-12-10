<script lang="ts">
	import { page } from '$app/stores';
	import type { ComponentProps } from 'svelte';

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();
</script>

<nav class="mobile-nav">
	<a href="/streak" class:active={$page.url.pathname === '/streak' || $page.url.pathname === '/'}>
		<span class="icon">🔥</span>
		<span class="label">Motivation</span>
	</a>
	<a href="/stats" class:active={$page.url.pathname === '/stats'}>
		<span class="icon">📊</span>
		<span class="label">Analytics</span>
	</a>
</nav>

<style>
	.mobile-nav {
		display: none;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
		z-index: 999;
		height: 70px;
		padding: 0.5rem 0;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.mobile-nav {
			display: flex;
		}
	}

	.mobile-nav a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: rgba(255, 255, 255, 0.7);
		padding: 0.5rem;
		border-radius: 0.5rem;
		transition: all 0.3s ease;
		flex: 1;
		height: 100%;
		gap: 0.3rem;
	}

	.mobile-nav a:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	.mobile-nav a.active {
		color: white;
		background: rgba(255, 255, 255, 0.2);
	}

	.icon {
		font-size: 1.5rem;
		line-height: 1;
	}

	.label {
		font-size: 0.7rem;
		font-weight: 600;
		white-space: nowrap;
	}
</style>
