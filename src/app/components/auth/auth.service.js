(function () {
  'use strict';
  angular
    .module('portalClient')
    .factory('AuthService', AuthService);

  function AuthService(ApplicationProperties, LocalStorage, $http, $q, $state) {
    var currentUser = null;

    var saveCredential = function (user) {
      if ((user !== null) && (user !== 'undefined')) {

        var lastAccess = ' Primeiro acesso';
        if (user.lastAccess != null) {
          lastAccess = user.lastAccess;
        }

        var credential = {
          "id": user.idFhir,
          "name": user.name,
          "username": user.username,
          "type": user.type,
          "token": user.token,
          "lastAccess": lastAccess
        };

        LocalStorage.putObject(ApplicationProperties.CREDENTIAL, credential);
      }
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   credential - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'auth/login', {
          username: credential.username,
          password: credential.password,
          type: credential.type
        }).
          success(function (data) {

            LocalStorage.put(ApplicationProperties.TOKEN_NAME, data.token);
            currentUser = data;

            //Evita usuários diferentes em abas diferentes
            LocalStorage.remove('LOGON_CHANGED');
            var logonChanged = true;
            LocalStorage.put('LOGON_CHANGED', logonChanged);

            saveCredential(currentUser);
            LocalStorage.put('PATIENT_SELECTED', currentUser.idFhir);

            deferred.resolve(data);
            return cb();
          }).error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function (redirect) {
        LocalStorage.remove('LOGON_CHANGED');

        LocalStorage.remove(ApplicationProperties.TOKEN_NAME);
        LocalStorage.remove(ApplicationProperties.IDLE);

        LocalStorage.remove('CREDENTIAL');
        LocalStorage.remove('PERFIL_ID');
        LocalStorage.remove('PATIENT_SELECTED');

        currentUser = null;

        if (redirect || angular.isUndefined(redirect)) {
          $state.go('root.login');
        }
      },

      /**
       * Requisita o envio de um e-mail para redefinir a senha do usuário
       *
       * @param  {String}   email
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      passwordRemember: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'auth/remember/password',
          credential
        ).
          success(function (data) {

            deferred.resolve(data);
            return cb();

          }).error(function (error) {
            deferred.reject(error);
            return cb(error);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Requisita o envio de um e-mail para redefinir a senha do usuário
       *
       * @param  {String}   email
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      usernameRemember: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'auth/remember/username',
          credential
        ).success(function (data) {

          deferred.resolve(data);
          return cb();

        }).error(function (error) {
          deferred.reject(error);
          return cb(error);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Requisita a validação de um token JWT
       *
       * @param  {String}   token
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      validateToken: function (token, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'auth/token/validate/password',
          token
        ).
          success(function (data) {

            deferred.resolve(data);
            return cb();

          }).error(function (error, status) {
            deferred.reject(status);
            return cb(status);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Requisita a alteração de senha de um usuário
       *
       * @param  {Credential} credential
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      resetPassword: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'auth/password/reset', {
          username: credential.username,
          newPassword: credential.password,
          birthDate: credential.birthDate,
          type: credential.type,
          idFhir: credential.idFhir,
          token: credential.token,
          password: credential.oldPassword
        }).
          success(function (data) {

            deferred.resolve(data);
            return cb();

          }).error(function (error) {
            deferred.reject(error);
            return cb(error);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Requisita a alteração de senha de um usuário
       *
       * @param  {Credential} credential
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      signup: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'user/signup', {
          username: credential.username,
          password: credential.password,
          birthDate: credential.birthDate,
          type: credential.type,
          idFhir: credential.idFhir,
          token: credential.token
        }).
          success(function (data) {

            deferred.resolve(data);
            return cb();

          }).error(function (error) {
            deferred.reject(error);
            return cb(error);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Requisita a alteração de senha de um usuário
       *
       * @param  {Credential} credential
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      generateResetPasswordToken: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'api/auth/password/reset/token', {
          username: credential.username,
          idFhir: credential.idFhir,
          type: credential.type
        }).
          success(function (data) {

            deferred.resolve(data);
            return cb();

          }).error(function (error, status) {
            deferred.reject(status);
            return cb(status);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Verifica se o usuário tem permissão para acessar a rota.
       */
      hasPermission: function (resource) {
        if (currentUser == null) {
          return false;
        }

        if (!currentUser.type) {
          return false;
        }

        return (resource.indexOf(currentUser.type) >= 0);
      },

      /**
       * Checa se o usuário está logado.
       */
      isLoggedInAsync: function (cb) {
        if (currentUser == null) {
          var userTemp = LocalStorage.getObject('CREDENTIAL');
          if (userTemp) {
            currentUser = userTemp;
            cb(true);
          } else {
            cb(false);
          }
        } else if (currentUser.hasOwnProperty(ApplicationProperties.CREDENTIAL_TYPE)) {
          cb(true);
        } else {
          cb(false);
        }
      },


      /**
       * Requisita a renovação da sessão do usuário
       *
       * @param  {Token} token
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      renewSession: function (token, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(ApplicationProperties.BASE_APP + 'api/auth/session/renew', {
          token: token
        }).
          success(function (data) {
            deferred.resolve(data);
            return cb();
          }).error(function (error) {
            deferred.reject(error);
            return cb(error);
          }.bind(this));

        return deferred.promise;
      }

    }
  }
}
)();
