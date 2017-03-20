package daggerok.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class ReactPage {

    @GetMapping({"", "/", "/react", "/react.html"})
    public String index(HttpServletRequest request) {
        return "/index.html";
    }
}
