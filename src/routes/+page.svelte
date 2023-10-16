<script>
import Counter from './Counter.svelte';
import welcome from '$lib/images/svelte-welcome.webp';
import welcome_fallback from '$lib/images/svelte-welcome.png';
import {onMount} from 'svelte';

let count = 0;
let client = null;
onMount(async() => {
	const res = await fetch('/api');
	const data = await res.json();
	console.log('api_res',data);
	count = data.count;
	init_ws(data.ws_addr);
});

const init_ws = (ws_addr) => {
	if(client !== null) return;

	console.log("init_ws", ws_addr);

	// client = new WebSocket("ws://127.0.0.1:5173/websocket") ;
	client = new WebSocket(ws_addr);
	client.socketId = -1;
	client.addEventListener("open", ()=>{
		console.log("ws-open");
		client.send(JSON.stringify({
			cmd:"login",
		}));
	});
	client.addEventListener("message", (e)=>{
		const req = JSON.parse(e.data);
		console.log('message', req);
        
		if(req.cmd == "res_login") {
			client.socketId = req.id;
		} else {
			console.log("message else");
		}
	});
}

const onClick = async () => {
	console.log('onClick');

	const res = await fetch('/api');
	const data = await res.json();
	console.log('api_res',data);

	count = data.count;
}
</script>




<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<div class="m-4 p-4 rounded-xl  bg-black text-white text-xl">
		<div>count: {count}</div>
		<button 
			type="button" 
			class="btn variant-filled"
			on:click={onClick}
		>
			Button
		</button>
	</div>

	<div>
		
	</div>

	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
