<script>
  import { userState } from "$lib/state.svelte.js";
  let name = userState.name;
</script>

<input bind:value={name} />
<p>User name: {userState.name}</p>
<button
  onclick={() => {
    userState.name = name;
  }}
>
  change name
</button>
