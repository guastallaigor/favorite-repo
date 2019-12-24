export default function({ $axios }) {
  $axios.onRequest((config) => {
    config.headers['Content-Type'] = 'application/json'
    config.headers['Access-Control-Allow-Origin'] = '*'
  })
}
