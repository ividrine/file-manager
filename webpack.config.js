var path = require('path');

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: [
		'./AppContainer.js'
	],
	output: {
		path: path.join(__dirname, 'src', 'static', 'js'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/, 
				exclude: /node_modules/,
				use: [
					'babel-loader'
				],
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
			},
			{
				test: /\.svg$/,
				loaders: ["svg-loader"]
			}
		]
	}
}
