function get_average_acceleration (list: any[]) {
    number_of_accelerations = previous_accelerations.length
    total = 0
    for (let value of list) {
        total = total + value
    }
    return total / number_of_accelerations
}
// Change this to change what happens when the alarm goes off!
function alarm () {
    for (let index = 0; index < 3; index++) {
        soundExpression.hello.playUntilDone()
    }
}
function update_list (list: any[], num: number) {
    list.push(num)
    if (list.length > 10) {
        list.shift()
    }
}
// This an 'event', set to run code when the accelerometer has new data for us. We can put the same blocks in 'run forever' too, but this *might* be a little better for the battery since it won't run as often.
control.onEvent(EventBusSource.MICROBIT_ID_ACCELEROMETER, EventBusValue.MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE, function () {
    // First, we gotta get the current acceleration.
    current_acceleration = input.acceleration(Dimension.Strength)
    // Then, we get the average of the last 10 samples, to see if we're moving in a different direction than before.
    average_acceleration = get_average_acceleration(previous_accelerations)
    // This math tells us the difference between our average and the current value. The absolute is used because we care about negative directions too!
    absolute_magnitude = Math.abs(current_acceleration - average_acceleration)
    // I used this plot to help 'debug' the code. It's hard to fix things when you don't know what the values actually are!
    led.plotBarGraph(
    absolute_magnitude,
    sensitivity
    )
    // This function updates the list we use for our average, and makes sure it doesn't get too big.
    update_list(previous_accelerations, current_acceleration)
    // Finally, we check what our magnitude is and if it's higher than our sensitivity, we raise the alarm! 
    if (absolute_magnitude > sensitivity) {
        alarm()
        previous_accelerations = [input.acceleration(Dimension.Strength)]
    }
})
// Here we initialize some settings and variables we're going to use later on.
let absolute_magnitude = 0
let average_acceleration = 0
let current_acceleration = 0
let total = 0
let number_of_accelerations = 0
let sensitivity = 0
let previous_accelerations: number[] = []
// This tells the micro:bit we want to detect large-ish movements.
input.setAccelerometerRange(AcceleratorRange.EightG)
// This list will keep the last 10 measurements, so we can average them out and get an idea of what 'normal' acceleration is.
previous_accelerations = [input.acceleration(Dimension.Strength)]
// This is used later on to compare to the current acceleration to the average, to make it less sensitive. The smaller the number is, the more sensitive it is! Just sitting on a table it would have a difference of about 100, so anything larger than that should work.
sensitivity = 200
