const path = require('path');
const DtsBundleWebpack = require('dts-bundle-webpack');


const envMode = process.env.NODE_ENV;
const entryName = 'luff-react-component';

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
        react: 'react',
        'react-dom': 'react-dom',
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
        new DtsBundleWebpack({
            name: entryName,
            main: path.resolve(__dirname, './d/luff-react-component/src/index.d.ts'),
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
        ]
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
        alias: {
            luff: path.resolve('./node_modules/luff'),
        },
    }
};
