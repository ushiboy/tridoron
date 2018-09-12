module.exports = {
  'presets': [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-flow'
  ],
  'env': {
    'development': {
      'presets': [
        'power-assert'
      ]
    }
  }
}
