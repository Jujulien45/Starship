from build123d import (
    Align, Box, BuildPart, Compound, Cylinder, Locations, Mode,
    export_step, export_stl,
)

from ocp_vscode import show

# CanSat limits and enclosure dimensions (mm).
MAX_DIAMETER = 66
MAX_HEIGHT = 115
DIAMETER = 64
HEIGHT = 110
WALL = 2
FLOOR = 2
LID_THICKNESS = 3
LID_LIP_DEPTH = 5
LID_CLEARANCE = 0.25  # Radial clearance per side.

# Placeholder cutout for a top-mounted master switch.
SWITCH_WIDTH = 12
SWITCH_LENGTH = 6

# SafeTag Mini 4G, upright inside the enclosure.
TRACKER_WIDTH = 35
TRACKER_DEPTH = 20
TRACKER_HEIGHT = 70

ON_PLANE = (Align.CENTER, Align.CENTER, Align.MIN)


def build_enclosure():
    radius = DIAMETER / 2
    inner_radius = radius - WALL
    body_height = HEIGHT - LID_THICKNESS
    lip_bottom = body_height - LID_LIP_DEPTH
    lip_radius = inner_radius - LID_CLEARANCE

    if not (
        0 < DIAMETER <= MAX_DIAMETER
        and 0 < HEIGHT <= MAX_HEIGHT
        and 0 < WALL < radius
        and 0 < LID_CLEARANCE < inner_radius
        and LID_THICKNESS > 0
        and LID_LIP_DEPTH > 0
        and 0 < FLOOR < lip_bottom
    ):
        raise ValueError("Check enclosure dimensions against the CanSat envelope.")

    if not (
        SWITCH_WIDTH > 0
        and SWITCH_LENGTH > 0
        and SWITCH_WIDTH**2 + SWITCH_LENGTH**2 < (2 * lip_radius)**2
    ):
        raise ValueError("The switch cutout must fit inside the lid lip.")

    if not (
        TRACKER_WIDTH**2 + TRACKER_DEPTH**2 < (2 * inner_radius)**2
        and TRACKER_HEIGHT < lip_bottom - FLOOR
    ):
        raise ValueError("The upright tracker must fit inside the enclosure.")

    with BuildPart() as body:
        Cylinder(radius, body_height, align=ON_PLANE)
        with Locations((0, 0, FLOOR)):
            Cylinder(inner_radius, body_height - FLOOR, align=ON_PLANE, mode=Mode.SUBTRACT)

    with BuildPart() as lid:
        with Locations((0, 0, body_height)):
            Cylinder(radius, LID_THICKNESS, align=ON_PLANE)
        with Locations((0, 0, lip_bottom)):
            Cylinder(lip_radius, LID_LIP_DEPTH, align=ON_PLANE)
            Box(
                SWITCH_WIDTH, SWITCH_LENGTH, LID_LIP_DEPTH + LID_THICKNESS,
                align=ON_PLANE, mode=Mode.SUBTRACT,
            )

    return Compound(children=[body.part, lid.part])


def export():   
    result = build_enclosure()
    export_step(result, "build123d/cansat.step")
    export_stl(result, "build123d/cansat.stl")
    show(result)
