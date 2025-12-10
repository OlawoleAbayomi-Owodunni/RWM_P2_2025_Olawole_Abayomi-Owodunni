<script lang="ts">
	import type { TaskData } from '@ayola/stats-visualizer';
	import { getAppTime } from '$lib/utils/storage';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onSave: (task: TaskData) => void;
	}

	let { isOpen = false, onClose, onSave }: Props = $props();

	let formData = $state({
		title: '',
		description: '',
		completionDate: getAppTime().toISOString().split('T')[0]
	});

	function handleSave() {
		if (!formData.title.trim()) {
			alert('Please enter a task title');
			return;
		}

		const newTask: TaskData = {
			id: `task-${Date.now()}`,
			title: formData.title,
			description: formData.description,
			completedAt: Math.floor(new Date(formData.completionDate).getTime() / 1000),
			totalSessions: 0,
			averageRating: 0
		};

		onSave(newTask);
		resetForm();
		onClose();
	}

	function resetForm() {
		formData = {
			title: '',
			description: '',
			completionDate: getAppTime().toISOString().split('T')[0]
		};
	}

	function handleClose() {
		resetForm();
		onClose();
	}
</script>

{#if isOpen}
	<div class="modal-overlay" onclick={handleClose}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2>Create New Task</h2>
				<button class="close-btn" onclick={handleClose}>&times;</button>
			</div>

			<div class="modal-body">
				<div class="form-group">
					<label for="title">Task Title *</label>
					<input
						id="title"
						type="text"
						bind:value={formData.title}
						placeholder="Enter task title"
					/>
				</div>

				<div class="form-group">
					<label for="description">Description</label>
					<textarea
						id="description"
						bind:value={formData.description}
						placeholder="Describe what this task is about (optional)"
					></textarea>
				</div>

				<div class="form-group">
					<label for="date">Completion Date</label>
					<input id="date" type="date" bind:value={formData.completionDate} />
				</div>
			</div>

			<div class="modal-footer">
				<button class="secondary-btn" onclick={handleClose}>Cancel</button>
				<button class="primary-btn" onclick={handleSave}>Create Task</button>
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

	.form-group input[type='text'],
	.form-group input[type='date'],
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.2s;
	}

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

		.modal-footer {
			flex-direction: column;
		}
	}
</style>
