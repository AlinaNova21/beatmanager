export default function ({ store, redirect }) {
  if (!store.state.config.beatSaberDir) {
    return redirect('/config')
  }
}