package com.library_web.library.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class CategoryChild {
    @Id
    private String id;  

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    @JsonIgnore
    private Category parent;

    public CategoryChild() {}

    public CategoryChild(Category parent, String suffix, String name) {
        this.id = parent.getId() + suffix;
        this.parent = parent;
        this.name = name;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Category getParent() { return parent; }
    public void setParent(Category parent) { this.parent = parent; }
}
