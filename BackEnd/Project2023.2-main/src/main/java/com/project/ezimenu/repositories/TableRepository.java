package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<Table, Long> {
    @EntityGraph(attributePaths = {})
    @Query("select t from Table t where t.tableId = :tableId")
    Optional<Table> findByIdWithoutRelations(@Param("tableId") Long tableId);

    Optional<Table> findByTableIdAndStatus(Long tableId, short active);

    List<Table> findByStatus(short active);

    List<Table> findByTableStatusIgnoreCaseAndStatus(String đang_trống, short active);

    Optional<Table> findByTableNameAndStatus(String tableName, short active);
}
