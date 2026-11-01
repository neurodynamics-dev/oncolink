/* OncoLink · configuração do Web Push.
   Sem chave, o app funciona em modo de demonstração: o service worker mostra
   notificações locais. Para push vindo do servidor, preencha a chave pública
   VAPID e o endereço que guarda as inscrições (POST com o JSON da inscrição). */
window.OL_PUSH = {
  vapidPublicKey: '',
  endpoint: ''
};
