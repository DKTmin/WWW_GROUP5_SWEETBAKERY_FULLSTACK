package iuh.fit.se.entities;


import jakarta.persistence.*;

import java.util.List;

@Entity
public class Customer extends User{
   Integer loyaltyPoints; // diemt tich luy
}
