(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('OrganizationListController', OrganizationListController);

  function OrganizationListController() {

    var vm = this;
    vm.search = [];
    vm.organizations = [];

    var organization = {};
    organization.name = 'HOSPITAL COPASTAR';
    organization.address = 'Rua Figueiredo de Magalhães, 700 - Copacabana - Rio de Janeiro - RJ';
    organization.phone = '(21) 3445-2800';
    vm.organizations.push(organization);

    organization = {};
    organization.name = 'HOSPITAL COPA D\'OR';
    organization.address = 'Rua Figueiredo de Magalhães, 875 - Copacabana - Rio de Janeiro - RJ';
    organization.phone = '(21) 2545-3600';
    vm.organizations.push(organization);

    organization = {};
    organization.name = 'HOSPITAL BARRA D\'OR';
    organization.address = 'Av. Ayrton Senna, 3079 - Barra da Tijuca - Rio de Janeiro - RJ';
    organization.phone = '(21) 3089-3600';
    vm.organizations.push(organization);
    
    organization = {};
    organization.name = 'HOSPITAL QUINTA D\'OR';
    organization.address = 'Rua Almirante Baltazar, 435 - São Cristovão - Rio de Janeiro - RJ';
    organization.phone = '(21) 1111-1111';
    vm.organizations.push(organization);
    
    organization = {};
    organization.name = 'HOSPITAL RIOS D\'OR';
    organization.address = 'Estrada dos Três Rios, 1366 - Freguesia - Jacarepaguá - Rio de Janeiro - RJ';
    organization.phone = '(21) 2448-3600';
    vm.organizations.push(organization);
    
    organization = {};
    organization.name = 'HOSPITAL CAXIAS D\'OR';
    organization.address = 'Av Brigadeiro Lima e Silva, 821 Jd Vinte e Cinco de Agosto - Duque de Caxias - RJ';
    organization.phone = '(21) 3461-3600';
    vm.organizations.push(organization);
    
    organization = {};
    organization.name = 'HOSPITAL NITERÓI D\'OR';
    organization.address = 'Av. Sete de Setembro, 301 - Santa Rosa - Niterói - RJ';
    organization.phone = '(21) 3602-1400';
    vm.organizations.push(organization);
    
    organization = {};
    organization.name = 'HOSPITAL NORTE D\'OR';
    organization.address = 'Rua Carolina Machado, 38 - Cascadura - Rio de Janeiro - RJ';
    organization.phone = '(21) 3747-3600';
    vm.organizations.push(organization);
    
    organization = {};
    organization.name = 'HOSPITAL OESTE D\'OR';
    organization.address = 'Rua Olinda Elis, 93 - Campo Grande - RJ';
    organization.phone = '(21) 2414-3600';
    vm.organizations.push(organization);
    
    organization = {};
    organization.name = 'IMAGEM D\'OR';
    organization.address = 'Rua Diniz Cordeiro, 39 - Botafogo - Rio de Janeiro - RJ';
    organization.phone = '(21) 3883-6000';
    vm.organizations.push(organization);
  }

})();