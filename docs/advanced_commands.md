<style>
body, .md-content, .md-main__inner {
    background-color: red !important;
}
</style>

# Advanced Commands

```
Everything you find on this page is dangerous. 

The first rule of TRMM Club is: You do not talk about TRMM Club.
The second rule of TRMM Club is: You do not talk about TRMM Club.
```

![](./images/2025-07-31-00-50-21.png)

!!!danger
    Use all commands here with caution, there is no undo. Have backups. You have been warned.

## Server Commands

### Remove agent history for one agent

Permanently deletes all history records for a specific agent. This is useful for cleaning up agents with corrupted history or reducing database size for agents.

**Keywords:** `agent history`, `delete history`, `cleanup`, `database maintenance`, `audit trail`, `task history`, `agent cleanup`

**Parameters:**
- Replace `CHANGEME` with the exact hostname of the target agent
- Ensure the agent hostname exists before running the command

```bash
/rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py shell -c 'from agents.models import Agent,AgentHistory;agent = Agent.objects.get(hostname="CHANGEME");to_delete = AgentHistory.objects.filter(agent=agent).values_list("id", flat=True);AgentHistory.objects.filter(id__in=to_delete).delete()'
```

### Get mapping of agent ID to mesh ID

TRMM Agent unique ID and MeshCentral nodeID

```bash
/rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py shell -c 'from agents.models import Agent; [print((i.agent_id, f"node//{i.hex_mesh_node_id}")) for i in Agent.objects.only("mesh_node_id") if i.mesh_node_id and i.hex_mesh_node_id != "error"]'
```
