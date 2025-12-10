<script lang="ts">
	import type { SessionData, TaskData } from '@ayola/stats-visualizer';
	import { getAppTime } from '$lib/utils/storage';

	interface Props {
		isOpen: boolean;
		tasks: TaskData[];
		onClose: () => void;
		onSave?: (session: SessionData) => void;
	}

	let { isOpen = false, tasks = [], onClose, onSave }: Props = $props();

	let formData = $state({
		taskId: tasks.length > 0 ? tasks[0].id : '',
		rating: 3,
		duration: 30,
		date: getAppTime().toISOString().split('T')[0],
		notes: ''
	});

	function handleSave() {
		if (!formData.taskId) {
			alert('Please select a task');
			return;
		}

		const newSession: SessionData = {
			id: `session-${Date.now()}`,
			taskId: formData.taskId,
			rating: formData.rating,
			duration: formData.duration,
			date: formData.date,
			notes: formData.notes
		};

		if (onSave) {
			onSave(newSession);
		}
		resetForm();
		onClose();
	}

	function resetForm() {
		formData = {
			taskId: tasks.length > 0 ? tasks[0].id : '',
			rating: 3,
			duration: 30,
			date: new Date().toISOString().split('T')[0],
			notes: ''
		};
	}

	function handleClose() {
		resetForm();
		onClose();
	}
</script>

{#if isOpen}
	<div class="modal-overlay" on:click={handleClose}>
		<div class="modal-content" on:click={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2>Add New Session</h2>
				<button class="close-btn" on:click={handleClose}>&times;</button>
			</div>

			<div class="modal-body">
				<div class="form-group">
					<label for="task">Task</label>
					<select id="task" bind:value={formData.taskId}>
						{#each tasks as task (task.id)}
							<option value={task.id}>{task.title}</option>
						{/each}
					</select>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="date">Date</label>
						<input id="date" type="date" bind:value={formData.date} />
					</div>

					<div class="form-group">
						<label for="duration">Duration (minutes)</label>
						<input id="duration" type="number" min="1" max="1440" bind:value={formData.duration} />
					</div>
				</div>

				<div class="form-group">
					<label for="rating">Rating</label>
					<div class="rating-selector">
						{#each [1, 2, 3, 4, 5] as rating}
							<button
								class="rating-btn"
								class:active={formData.rating === rating}
								on:click={() => (formData.rating = rating)}
							>
								{rating}
							</button>
						{/each}
					</div>
				</div>

				<div class="form-group">
					<label for="notes">Notes (optional)</label>
					<textarea id="notes" bind:value={formData.notes} placeholder="How did this session go?"></textarea>
				</div>
			</div>

			<div class="modal-footer">
				<button class="secondary-btn" on:click={handleClose}>Cancel</button>
				<button class="primary-btn" on:click={handleSave}>Save Session</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 500px;
		width: 90%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e0e0e0;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #333;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #999;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: #333;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
		font-size: 0.9rem;
	}

	.form-group select,
	.form-group input[type='date'],
	.form-group input[type='number'],
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.2s;
	}

	.form-group select:focus,
	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.rating-selector {
		display: flex;
		gap: 0.5rem;
	}

	.rating-btn {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 6px;
		background: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
	}

	.rating-btn:hover {
		border-color: #667eea;
		background: rgba(102, 126, 234, 0.05);
	}

	.rating-btn.active {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-color: transparent;
	}

	.modal-footer {
		display: flex;
		gap: 1rem;
		padding: 1.5rem;
		border-top: 1px solid #e0e0e0;
	}

	.primary-btn,
	.secondary-btn {
		flex: 1;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.primary-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.primary-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
	}

	.secondary-btn {
		background: #f0f0f0;
		color: #333;
	}

	.secondary-btn:hover {
		background: #e0e0e0;
	}

	@media (max-width: 480px) {
		.modal-content {
			width: 95%;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.modal-footer {
			flex-direction: column;
		}
	}
</style>
