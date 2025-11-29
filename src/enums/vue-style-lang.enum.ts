/**
 * Style language options for Vue single-file components
 * Determines the `lang` attribute in `<style>` tag
 */
export enum VueStyleLang {
	/**
	 * SCSS - Sass CSS preprocessor
	 * Generates: `<style lang="scss" scoped>`
	 */
	scss = "scss",

	/**
	 * CSS - Standard Cascading Style Sheets
	 * Generates: `<style scoped>`
	 */
	css = "css",
}
