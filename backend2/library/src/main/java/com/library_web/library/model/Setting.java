package com.library_web.library.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Setting {
    @Id
    private String id;
    private int finePerDay;
    private int waitingToTake;
    private int borrowDay;
    private int startToMail;
    public Setting(int finePerDay, int waitingToTake,int borrowDay, int startToMail ) {
        this.finePerDay = finePerDay;
        this.waitingToTake = waitingToTake;
        this.borrowDay = borrowDay;
        this.startToMail = startToMail;
    }
}