package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.response.ApiResponse;
import com.dhruv.arthrix.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService){
        this.workoutService=workoutService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkoutDTO>>> getAllWorkouts(){
        List<WorkoutDTO> workouts=workoutService.getAllWorkouts();
        ApiResponse<List<WorkoutDTO>> response=ApiResponse.success("Workouts fetched successfully",workouts);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{workoutId}")
    public ResponseEntity<ApiResponse<WorkoutDTO>> getWorkoutById(@PathVariable Long workoutId){
        WorkoutDTO workout=workoutService.getWorkoutById(workoutId);
        ApiResponse<WorkoutDTO> response=ApiResponse.success("Workout fetched successfully",workout);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<WorkoutDTO>>> getWorkoutsByGoalAndDifficulty(
            @RequestParam FitnessGoal goal,
            @RequestParam Difficulty difficulty) {

        List<WorkoutDTO> workouts = workoutService.getWorkoutsByGoalAndDifficulty(goal, difficulty);
        ApiResponse<List<WorkoutDTO>> response = ApiResponse.success("Filtered workouts fetched successfully", workouts);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
