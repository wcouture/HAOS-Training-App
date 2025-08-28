import { Circuit, ProgramDay, ProgramSegment, Session, TrainingProgram } from "@/Models/TrainingTypes";

export async function getSubsrcibedPrograms(userId: number): Promise<TrainingProgram[]> {
    // Mock data for demonstration purposes
    const mockPrograms: TrainingProgram[] = [];
    
    // In a real implementation, you would fetch this data from a database or API
    return mockPrograms;
}

export async function getProgramData(programId: number): Promise<TrainingProgram | null> {
    let response = await fetch("https://haos.willc-dev.net/programs/find/" + programId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    });

    if (response.ok) {
        let data = await response.json();
        return data as TrainingProgram;
    }

    return null;
}

export async function getSegmentData(segmentId: number): Promise<ProgramSegment | null> {
    let response = await fetch("https://haos.willc-dev.net/segments/find/" + segmentId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    });

    if (response.ok) {
        let data = await response.json();
        return data as ProgramSegment;
    }

    return null;
}

export async function getDayData(dayId: number): Promise<ProgramDay | null> {
    let response = await fetch("https://haos.willc-dev.net/days/find/" + dayId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
      })

    if (response.ok) {
        let data = await response.json();
        return data as ProgramDay;
    }
    return null;
}

export async function getSessionData(sessionId: number): Promise<Session | null> {
    let response = await fetch("https://haos.willc-dev.net/sessions/find/" + sessionId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },  })
    
    if (response.ok) {
        let data = await response.json();
        return data as Session;
    }

    return null;
}

export async function getCircuitData(circuitId: number): Promise<Circuit | null> {
    let response = await fetch("https://haos.willc-dev.net/circuits/find/" + circuitId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },})
    
    if (response.ok) {
        let data = await response.json();
        return data as Circuit;
    }
    
    return null;

}