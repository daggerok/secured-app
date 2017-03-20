package daggerok.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;

@Configuration
@EnableResourceServer
@ComponentScan(basePackageClasses = AppCorsFilter.class)
public class ResourceServerConfig {

    @Order(Ordered.HIGHEST_PRECEDENCE)
    public static class MyWebSecurity extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                .authorizeRequests()
                    .antMatchers(HttpMethod.OPTIONS, "/oauth/token").permitAll();
        }
    }
/*
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "HEAD", "OPTIONS", "TRACE", "POST", "PUT", "PATCH", "DELETE")
                        .allowedOrigins("http://localhost:9999/**", "http://localhost:8000/**", "*");
            }
        };
    }
*/
    @EnableAuthorizationServer
    public static class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

        @Autowired
        AuthenticationManager authenticationManager;

        @Override
        public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints.authenticationManager(authenticationManager);
        }

        @Override
        public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            clients
                .inMemory()
                    /**
                     * httpie in fish
                     * http -f -a trusted-client: post :9999/oauth/token grant_type=password username=usr password=pwd
                     * <p>
                     * {
                     * "access_token": "14d3a73e-f3aa-4a89-ae12-1e08bd1b745d",
                     * "expires_in": 248,
                     * "refresh_token": "f8ac5458-8237-400b-a557-fe2f2b83b540",
                     * "scope": "read write trust",
                     * "token_type": "bearer"
                     * }
                     * set t b0b44843-c53e-4d6f-9eaa-704ab4079909
                     * set h "Authorization: bearer $t"
                     * http :9999 $h
                     *
                     * <p>
                     *
                     * curl in bash:
                     * curl trusted-client:@localhost:9999/oauth/token -d grant_type=password -d username=usr -d password=pwd
                     * ...
                     * "access_token": "14d3a73e-f3aa-4a89-ae12-1e08bd1b745d",
                     * ...
                     * export t=b0b44843-c53e-4d6f-9eaa-704ab4079909
                     * export h="Authorization: bearer $t"
                     * http :9999 $h
                     *
                     * for debug see here:
                     * see: org.springframework.security.oauth2.provider.endpoint.TokenEndpoint#postAccessToken(java.security.Principal, java.util.Map)
                     */
                    //client_id
                    .withClient("trusted-client")
                    //response_type:
                    .authorizedGrantTypes("password", "authorization_code", "implicit", "refresh_token")
                    .authorities("ROLE_CLIENT", "ROLE_TRUSTED")
                    //scope:
                    .scopes("read", "write", "trust")
                    .resourceIds("secured-resource")
                    .accessTokenValiditySeconds(300)
                .and()
                    /**
                     * info is here: http://stackoverflow.com/questions/33377971/oauth2-spring-security-authorization-code
                     *
                     * http -a usr:pwd 'http://localhost:9999/oauth/authorize?response_type=code&client_id=client-with-redirect&redirect_uri=http://localhost:8080?key=value'
                     * or open in browser for the link:
                     * http://usr:pwd@localhost:9999/oauth/authorize?response_type=code&client_id=client-with-redirect&redirect_uri=http://localhost:8080?key=value
                     *
                     * post to endpoint: http://usr:pwd@localhost:9999/oauth/authorize
                     * next form data:
                     * - user_oauth_approval:true
                     * - scope.read:true
                     * - scope.trust:true
                     * - authorize:Authorize
                     *
                     * as result you will be redirected to:
                     * http://localhost:8080/?key=value&code=4o0FAp
                     *
                     * handle this properly withing you client app...
                     * and to get new token using code: 4o0FAp with command:
                     *
                     * http -f -a client-with-redirect: :9999/oauth/token grant_type=authorization_code client_id=client-with-redirect redirect_uri='http://localhost:8080?key=value' code=4o0FAp
                     * {
                     *   "access_token": "b5410be3-0b68-43ca-88df-46ba936757c0",
                     *   "expires_in": 300,
                     *   "scope": "trust read",
                     *   "token_type": "bearer"
                     * }
                     * set t b5410be3-0b68-43ca-88df-46ba936757c0
                     * set h "Authorization: bearer $t"
                     * http :9999 $h
                     */
                    .withClient("client-with-redirect")
                    .authorizedGrantTypes("authorization_code")
                    .authorities("ROLE_CLIENT")
                    .scopes("read", "trust")
                    .resourceIds("secured-resource")
                    .accessTokenValiditySeconds(300)
                    //redirect_uri:
                    .redirectUris("http://localhost:8080?key=value")
                .and()
                    /**
                     * http -f -a client-with-secret:client-password :9999/oauth/token grant_type=client_credentials username=usr password=pwd
                     * {
                     *   "access_token": "496a793b-95c4-4212-943b-eaf4bc600015",
                     *   "expires_in": 299,
                     *   "scope": "read",
                     *   "token_type": "bearer"
                     * }
                     * set t 496a793b-95c4-4212-943b-eaf4bc600015
                     * set h "Authorization: bearer $t"
                     * http :9999 $h
                     */
                    .withClient("client-with-secret")
                    .authorizedGrantTypes("client_credentials", "password")
                    .authorities("ROLE_CLIENT")
                    .scopes("read")
                    .resourceIds("secured-resource")
                    .accessTokenValiditySeconds(300)
                    .secret("client-password")
            ;
        }
    }
}
