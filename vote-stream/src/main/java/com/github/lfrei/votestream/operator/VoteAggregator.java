package com.github.lfrei.votestream.operator;

import com.jayway.jsonpath.JsonPath;
import net.minidev.json.JSONObject;
import org.apache.kafka.streams.kstream.Aggregator;

import java.util.HashMap;
import java.util.Map;

public class VoteAggregator implements Aggregator<String, String, String> {

    @Override
    public String apply(String key, String value, String aggregate) {
        String option = getOption(value);
        if (option == null) {
            return aggregate;
        }

        Map<String, Integer> votesByOption = getVotesByOption(aggregate);
        Integer votes = votesByOption.getOrDefault(option, 0);
        votesByOption.put(option, votes + 1);

        return buildAggregate(votesByOption);
    }

    private String buildAggregate(Map<String, Integer> votesByOption) {
        JSONObject votes = new JSONObject();
        votesByOption.forEach(votes::appendField);

        return new JSONObject()
                .appendField("votesByOption", votes)
                .toJSONString();
    }

    private String getOption(String vote) {
        if (vote == null) {
            return null;
        }
        Integer option = JsonPath
                .parse(vote)
                .read("$.option");

        return String.valueOf(option);
    }

    private Map<String, Integer> getVotesByOption(String aggregate) {
        if (aggregate == null) {
            return new HashMap<>();
        }

        return JsonPath
                .parse(aggregate)
                .read("$.votesByOption");
    }
}
