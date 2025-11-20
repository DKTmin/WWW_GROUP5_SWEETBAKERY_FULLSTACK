package iuh.fit.se.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Employee extends User{
    String CCCD; // can cuoc cong dan
    Integer numOfExperience;
}
