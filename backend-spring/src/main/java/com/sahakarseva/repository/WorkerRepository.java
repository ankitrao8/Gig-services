package com.sahakarseva.repository;

import com.sahakarseva.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, String> {

    Optional<Worker> findByWorkerId(String workerId);

    Optional<Worker> findByUserId(String userId);

    List<Worker> findBySocietyId(String societyId);

    List<Worker> findByAvailabilityStatus(String availabilityStatus);

    List<Worker> findByPrimaryTradeAndAvailabilityStatus(String primaryTrade, String availabilityStatus);

    /**
     * PostGIS Spatial Query: Finds verified workers within given radius (in meters)
     * using PostGIS ST_DWithin spatial geography and sorts by proximity (ST_DistanceSphere).
     */
    @Query(value = """
        SELECT * FROM workers w
        WHERE w.availability_status = 'AVAILABLE'
          AND (:trade IS NULL OR LOWER(w.primary_trade) = LOWER(:trade))
          AND (w.location IS NOT NULL AND ST_DWithin(
                w.location::geography,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                :radiusMeters
          ))
        ORDER BY ST_DistanceSphere(w.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)) ASC
    """, nativeQuery = true)
    List<Worker> findNearbyWorkersPostGis(
        @Param("lat") double lat,
        @Param("lon") double lon,
        @Param("radiusMeters") double radiusMeters,
        @Param("trade") String trade
    );
}
