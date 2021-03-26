const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
//const Preprocessor = require('webpack-preprocessor-loader');
const autoprefixier = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const DtsBundleWebpack = require('dts-bundle-webpack');


//regex ccs:`    import ["'][\w\.\/\\]+\.scss["'];\n`

const envMode = process.env.NODE_ENV;
const entryName = 'luff-comp';

const baseDir = path.resolve(__dirname, '../');

const entryPoint = path.resolve(__dirname, './src/index.tsx');
const outDir = path.resolve(baseDir, `./_dist/${entryName}`);



console.log('[Build][envMode] ', envMode);
console.log('[Build][outDir] ', outDir);

module.exports = {
    entry: {
        index: entryPoint
    },
    externals: {
        luff: 'luff',
    },
    output: {
        path: path.resolve(outDir),
        filename: "[name].js",
        library: entryName,
        libraryTarget:'umd',
        //umdNamedDefine: true
    },
    plugins: [

        //new HtmlWebpackPlugin({template: path.resolve(__dirname, './src/index.html')}),
        new MiniCssExtractPlugin(),
        new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { map: { inline: false, annotation: true, } } }),
        new DtsBundleWebpack({
            name: entryName,
            main: path.resolve(__dirname, './d/luff-comp/src/index.d.ts'),
            out: path.resolve(outDir, './index.d.ts'),
            headerText: "Luff's types declaration."
        }),
    ],
    module: {
        rules: [

            {
                test: /\.tsx?$/,
                use: [
                    "ts-loader",
                    {
                        loader: 'webpack-preprocessor-loader',
                        options: {
                            debug: envMode !== 'production',
                            directives: {
                                secret: false,
                            },
                            params: {
                                ENV: envMode,
                            },
                            verbose: false,
                        },
                    },

                ]
                //loader: "ts-loader",
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            //minimize: true,
                            sourceMap: true,
                            //importLoaders: 2,
                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: [
                                autoprefixier({
                                    grid: "no-autoplace",
                                    flexbox: false,

                                }),
                            ]
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            removeCR: true,
                        }
                        //options: {...}
                    },

                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                fiber: false,
                                linefeed: 'cr',
                            },
                        }
                    },

                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './img',
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff?2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './fonts',
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './',
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
        alias: {
            luff: path.resolve('./node_modules/luff'),
        },
    }
};
