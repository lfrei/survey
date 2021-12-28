package com.github.lfrei.votestream.operator;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.json.BasicJsonTester;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class VoteAggregatorTest {
    private final VoteAggregator voteAggregator = new VoteAggregator();
    private final BasicJsonTester json = new BasicJsonTester(getClass());

    @Test
    void apply_optionExiting_voteIncremented() {
        String votes = json.from("/votes.json").getJson();
        String vote = json.from("/vote_option1.json").getJson();

        String incrementedVotes = voteAggregator.apply("55555", vote, votes);

        assertThat(json.from(incrementedVotes)).extractingJsonPathMapValue("$.votesByOption")
                .isEqualTo(Map.of("1", 21, "2", 5));
    }

    @Test
    void apply_noPreviousVotes_voteAdded() {
        String vote = json.from("/vote_option2.json").getJson();

        String incrementedVotes = voteAggregator.apply("55555", vote, null);

        assertThat(json.from(incrementedVotes)).extractingJsonPathMapValue("$.votesByOption")
                .isEqualTo(Map.of("2", 1));
    }

    @Test
    void apply_newOption_voteAdded() {
        String votes = json.from("/votes.json").getJson();
        String vote = json.from("/vote_option3.json").getJson();

        String incrementedVotes = voteAggregator.apply("55555", vote, votes);

        assertThat(json.from(incrementedVotes)).extractingJsonPathMapValue("$.votesByOption")
                .isEqualTo(Map.of("1", 20, "2", 5, "3", 1));
    }
}