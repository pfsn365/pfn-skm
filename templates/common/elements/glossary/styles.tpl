<style>
	.glossary-wrapper {
		position: relative;
		width: 100%;
		display: flex;
	}

	.glossary-container {
		--spacing: 16px;
		--background: #E9F7F2;
		--border-color: #E9E9E9;
		--border-radius: 8px;

		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		background: var(--background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
	}

	.glossary-container .glossary-header {
		cursor: pointer;
		position: relative;
		width: 100%;
		padding: var(--spacing);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.glossary-container .glossary-header::after {
		content: "+";
		display: block;
		font-size: 30px;
		color: #000;
		position: absolute;
		right: var(--spacing);
		top: 50%;
		transform: translateY(-50%);
	}

	.glossary-container .glossary-header .glossary-header--text {
		width: 100%;
		color: #2D2D2D;
		font-weight: 600;
		font-size: 16px;
		line-height: 19px;
	}

	.glossary-container .glossary-content {
		width: 100%;
		padding: var(--spacing);
		border-top: 1px solid #E9E9E9;
		display: none;
	}

	.glossary-container .glossary-ref {
		display: none;
	}

	.glossary-container .glossary-ref:checked+.glossary-header::after {
		content: "-";
	}

	.glossary-container .glossary-ref:checked+.glossary-header+.glossary-content {
		display: block;
	}

	@media (max-width: 768px) {
		.glossary-container .glossary-header::after {
			font-size: 20px;
		}

		.glossary-container .glossary-header .glossary-header--text {
			font-size: 12px;
			line-height: 18px;
		}
	}

	{* Glossary items styles *}

	.glossary-container .glossary-content .glossary-items {
		display: flex;
		gap: 8px 30px;
		flex-wrap: wrap;
	}

	.glossary-container .glossary-content .glossary-items .glossary-item-title {
		width: 25%;
		color: #2D2D2D;
		font-weight: 600;
		font-size: 12px;
		line-height: 13px;
	}

	.glossary-container .glossary-content .glossary-items .glossary-item-value {
		width: 75%;
		color: #666666;
		font-size: 12px;
		line-height: 13px;
	}
</style>
