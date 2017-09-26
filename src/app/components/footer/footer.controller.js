(function() {
  'use strict';
  angular
  .module('portalClient')
    .controller('FooterController', FooterController);

    function FooterController (ApplicationProperties){
      var vm = this;

      vm.telefoneMarcacaoExames = ApplicationProperties.TELEFONE_MARCACAO_EXAMES;
      vm.emailMarcacaoExames = ApplicationProperties.EMAIL_MARCACAO_EXAMES;
      vm.telefoneAtendimento = ApplicationProperties.TELEFONE_ATENDIMENTO;
      vm.emailAtendimento = ApplicationProperties.EMAIL_ATENDIMENTO;
      vm.urlFacebook = ApplicationProperties.FACEBOOK;
      vm.urlTwitter = ApplicationProperties.TWITTER;
      vm.urlLinkedin = ApplicationProperties.LINKEDIN;
      vm.urlYoutube = ApplicationProperties.YOUTUBE;

    }
})();
