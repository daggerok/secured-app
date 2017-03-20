package daggerok.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ClientResource {

    @GetMapping("/")
    public Map<String, Object> get() {
        return new HashMap<String, Object>() {
            private static final long serialVersionUID = 8625175961295782431L;
            {
                put("one", "two");
            }
        };
    }

    @GetMapping("/me")
    public Principal principal(Principal principal) {
        return principal;
    }
}
