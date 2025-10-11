import eslintJS from '@eslint/js'
import eslintTS from 'typescript-eslint'

export default eslintTS.config(
	eslintJS.configs.recommended,
	eslintTS.configs.recommended,
);