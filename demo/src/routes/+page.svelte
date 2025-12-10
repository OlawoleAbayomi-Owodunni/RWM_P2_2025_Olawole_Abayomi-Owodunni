<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/streak', { replaceHistory: true });
  });
</script>

<style>
  .redirect {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  p {
    color: white;
    font-size: 1.2rem;
  }
</style>
