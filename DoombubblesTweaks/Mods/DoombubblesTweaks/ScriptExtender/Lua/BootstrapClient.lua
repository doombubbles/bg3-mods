local function on_reset_completed()
    local root = "Public/DoombubblesTweaks/Stats/Generated/Data"
    local hotreload = Ext.IO.LoadFile(root .. "/__HotReload.txt", "data")

    if hotreload == nil then
        ---@diagnostic disable-next-line: undefined-field
        Ext.Stats.LoadStatsFile(root .. "/__Data.txt", 1)
        return
    end

    for filename in hotreload:gmatch("([^\n]*)\n?") do
        local success = pcall(function()
            Ext.Stats.LoadStatsFile(root .. "/" .. filename, 1)
        end)
        if success then
            _P('Sucessfully Reloaded ' .. filename)
        else
            _P('FAILED Reloaded ' .. filename)
        end
    end
end

Ext.Events.ResetCompleted:Subscribe(on_reset_completed)
