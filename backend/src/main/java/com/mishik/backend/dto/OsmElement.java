package com.mishik.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OsmElement {
    public long id;
    public double lat;
    public double lon;

    public Map<String, String> tags;

    public Center center;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Center {
        public double lat;
        public double lon;
    }
}
